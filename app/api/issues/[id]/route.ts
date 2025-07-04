import authOptions from "@/app/auth/authOptions";
import { issuePatchSchema } from "@/app/validationSchemas";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }
  const body = await request.json();
  const validation = issuePatchSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { id } = await params;
  const inputId = parseInt(id);
  if (isNaN(inputId)) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }
  const issue = await prisma.issue.findUnique({
    where: { id: inputId },
  });

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const { assignedToUserId } = body;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
  }

  const newIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: validation.data,
  });
  return NextResponse.json(newIssue);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }
  const { id } = await params;
  const inputId = parseInt(id);
  const issue = await prisma.issue.findUnique({
    where: { id: inputId },
  });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
  const deletedIssue = await prisma.issue.delete({
    where: { id: inputId },
  });
  return NextResponse.json(deletedIssue);
}
