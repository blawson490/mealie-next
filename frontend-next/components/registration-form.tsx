"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppConfig, StartupInfo } from "@/lib/types/app";
import BasicError from "./ui/custom/basic-error";
import { ActionCard, ActionCardGroup } from "./ui/custom/auth/action-cards";

interface RegistrationFormProps extends React.ComponentProps<"div"> {
  config: AppConfig;
  startupInfo: StartupInfo;
}

type RegistrationStep = "selection" | "join" | "create";

export function RegistrationForm({
  className,
  config,
  startupInfo,
  ...props
}: RegistrationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>("selection");

  if (!config.allowPasswordLogin && !config.enableOidc) {
    return (
      <BasicError error="No login methods are enabled. Please contact the administrator." />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full gap-6",
        className
      )}
      {...props}
    >
      <Card
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          step === "selection" ? "w-full max-w-2xl" : "w-[320px] sm:w-[375px]"
        )}
      >
        <CardHeader className="relative pb-2 text-center">
          <CardTitle className="text-2xl font-bold pt-1">
            {step === "selection" && "User Registration"}
            {step === "join" && "Join a Group"}
            {step === "create" && "Create Group"}
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            "transition-all duration-300",
            step === "selection" ? "px-8 pt-2 pb-6" : "px-6 pb-6 pt-2"
          )}
        >
          {step === "selection" && (
            <ActionCardGroup
              onValueChange={(val) => setStep(val as RegistrationStep)}
            >
              <ActionCard
                value="join"
                icon={<Users size={40} />}
                title="Join a Group"
                description="Connect to an existing household using an invite token"
              />
              <ActionCard
                value="create"
                icon={<Plus size={40} />}
                title="New Group"
                description="Start fresh by creating a new household organization"
              />
            </ActionCardGroup>
          )}

          {step === "join" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 mx-auto max-w-[270px] sm:max-w-[325px]">
              <p className="text-sm text-muted-foreground">
                Please provide the registration token associated with the group
                that you'd like to join. You'll need to obtain this from an
                existing group member.
              </p>
              <div className="space-y-2">
                <Label htmlFor="token">Group Token</Label>
                <Input id="token" placeholder="Enter token" />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("selection")}
                  className=""
                >
                  Back
                </Button>
                <Button className="">Continue</Button>
              </div>
            </div>
          )}

          {step === "create" && (
            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-right-4 duration-300 mx-auto max-w-[270px] sm:max-w-[325px]">
              <p className="text-sm text-muted-foreground text-center">
                Enter details to create a new household.
              </p>
              {/* TODO: Add actual form fields here */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("selection")}
                  className=""
                >
                  Back
                </Button>
                <Button className="" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* {step === "selection" && ( */}
      <div className="text-sm text-muted-foreground animate-in fade-in duration-500">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => router.push("/login")}
        >
          Sign in
        </Button>
      </div>
      {/* )} */}
    </div>
  );
}
