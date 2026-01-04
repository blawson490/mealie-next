"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCalendar,
  IconCalendarPlus,
  IconCheck,
  IconClock,
  IconCopy,
  IconEye,
  IconInfoCircle,
  IconLink,
  IconLoader,
  IconLoader2,
  IconLock,
  IconShare2,
  IconTrash,
  IconWorld,
} from "@tabler/icons-react";
import { JSXElementConstructor, ReactElement, useState } from "react";
import { useEffect } from "react";
import {
  addToMealPlanAction,
  createSharedRecipeLinkAction,
  deleteSharedRecipeLinkAction,
  getSharedRecipesAction,
  updateRecipePrivacyAction,
} from "@/app/actions/recipe-actions";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanEntryType } from "@/lib/api/generated/model";
import { ApiErrorSheet } from "@/components/api-error/api-error-sheet";

export default function AddToMealPlanDialog({
  recipeId,
  recipeName,
  isOpen,
  onOpenChange,
}: {
  recipeId: string;
  recipeName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const mealOptions = [
    { value: "", label: "Unassigned" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "side", label: "Side" },
    { value: "snack", label: "Snack" },
    { value: "drink", label: "Drink" },
    { value: "dessert", label: "Dessert" },
  ];
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    const date = formData.get("date") as string;
    const entryType = formData.get("entry-type") as PlanEntryType;
    const planEntry = {
      date,
      entryType,
      recipeId,
    };
    const result = await addToMealPlanAction(planEntry);
    if (result.success) {
      toast.success("Recipe added to meal plan!");
      onOpenChange(false);
    } else {
      toast.error("Failed to add to meal plan", {
        action: {
          label: "See More",
          onClick: () => setErrorDetails(result.error),
        },
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="flex flex-row items-center justify-start gap-3 border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center justify-center p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
              <IconCalendarPlus className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-left">
              <DialogTitle className="text-lg">Add to Meal Plan</DialogTitle>
              <DialogDescription className="truncate font-medium text-slate-500">
                {recipeName}
              </DialogDescription>
            </div>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="date">Select a date</FieldLabel>
              <Input id="date" name="date" type="date" defaultValue={today} />
            </Field>
            <Field>
              <FieldLabel htmlFor="entry-type" defaultValue={""}>
                Entry Type
              </FieldLabel>
              <Select
                items={mealOptions}
                defaultValue={""}
                name="entry-type"
                id="entry-type"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {mealOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose the meal type for this recipe.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter className="pt-4">
            <DialogClose
              render={
                <Button variant="outline" size={"lg"} disabled={isLoading}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" size={"lg"} disabled={isLoading}>
              <span>
                {isLoading ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  "Add to Meal Plan"
                )}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <ApiErrorSheet
        open={!!errorDetails}
        onOpenChange={(open) => !open && setErrorDetails(null)}
        error={errorDetails}
      />
    </Dialog>
  );
}
