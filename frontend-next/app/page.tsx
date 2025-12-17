import { ComponentExample } from "@/components/component-example";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  //   return <ComponentExample />;
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
