import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { registerSchema } from "@/app/validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }
  const sameUser = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (sameUser) {
    return NextResponse.json(
      { error: "A user with the same email exists" },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      name: body.email.split("@")[0],
      hashedPassword: hashedPassword,
    },
  });
  return NextResponse.json({ email: newUser.email });
}
