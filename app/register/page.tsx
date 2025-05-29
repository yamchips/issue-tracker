"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorMessage } from "../components";
import { registerSchema } from "../validationSchemas";

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();
  const [errorInfo, setErrorInfo] = useState("");
  const submitFunc = async (data: RegisterForm) => {
    try {
      await axios.post("/api/register", data);
      router.push("/api/auth/signin");
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErrorInfo(error.response?.data.error);
      } else {
        setErrorInfo("An unexpected error happened");
      }
    }
  };
  return (
    <div className="max-w-3xs space-y-4">
      {errorInfo && (
        <Callout.Root>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{errorInfo}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-4" onSubmit={handleSubmit(submitFunc)}>
        <TextField.Root
          {...register("email")}
          placeholder="email"
          type="email"
        />
        <ErrorMessage>{errors.email?.message}</ErrorMessage>
        <TextField.Root
          {...register("password")}
          placeholder="password"
          type="password"
        />
        <ErrorMessage>{errors.password?.message}</ErrorMessage>
        <Button>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
