"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeShareTokenSummary } from "@/lib/types/recipe";
import {
  IconCalendar,
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
import { useState } from "react";
import { useEffect } from "react";
import {
  createSharedRecipeLinkAction,
  deleteSharedRecipeLinkAction,
  getSharedRecipesAction,
  updateRecipePrivacyAction,
} from "@/app/actions/recipe-actions";
import { toast } from "sonner";

export default function RecipeShareDialog({
  recipeId,
  recipeName,
  recipeSlug,
  initialIsPublic,
}: {
  recipeId: string;
  recipeName: string;
  recipeSlug: string;
  initialIsPublic: boolean;
}) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const recipeUrl = `${origin}/recipes/${recipeSlug}`;
  const baseShareUrl = `${origin}/shared/`;
  const [selectedExpiry, setSelectedExpiry] = useState("30 Days");
  const [customDate, setCustomDate] = useState("");

  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [tokens, setTokens] = useState<RecipeShareTokenSummary[]>([]);
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [loadingShare, setLoadingShare] = useState<{ tokenId: string } | null>(
    null
  );
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(false);

  useEffect(() => {
    const loadSharedLinks = async () => {
      try {
        const response = await getSharedRecipesAction(recipeId);
        setTokens(response.sharedRecipes);
      } catch (error) {
        setTokens([]);
      }
    };

    loadSharedLinks();
  }, [recipeId]);

  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus((prev) => ({ ...prev, [key]: true }));
      toast.success("Link copied to clipboard!");
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    setLoadingShare({ tokenId: id });
    const deleteLink = async () => {
      try {
        const response = await deleteSharedRecipeLinkAction(id, recipeId);
        if (response.success && response.sharedRecipes) {
          setTokens(response.sharedRecipes);
          toast.success("Guest link deleted successfully!");
        } else {
          toast.error("Failed to delete guest link.");
        }
      } catch (error) {
        toast.error(
          "An error occurred while deleting the guest link.:" + error
        );
      } finally {
        setLoading(false);
        setLoadingShare(null);
      }
    };
    deleteLink();
  };

  const handleGenerate = () => {
    setLoading(true);
    const createSharedLink = async () => {
      try {
        const response = await createSharedRecipeLinkAction(
          recipeId,
          selectedExpiry === "Custom" && customDate
            ? new Date(customDate).getTime()
            : selectedExpiry === "1 Day"
            ? Date.now() + 1 * 24 * 60 * 60 * 1000
            : selectedExpiry === "7 Days"
            ? Date.now() + 7 * 24 * 60 * 60 * 1000
            : selectedExpiry === "30 Days"
            ? Date.now() + 30 * 24 * 60 * 60 * 1000
            : selectedExpiry === "1 Year"
            ? Date.now() + 365 * 24 * 60 * 60 * 1000
            : undefined
        );
        if (response.success && response.sharedRecipes) {
          setTokens(response.sharedRecipes);
          toast.success("Guest link created successfully!");
        } else {
          toast.error("Failed to create guest link.");
        }
      } catch (error) {
        toast.error(
          "An error occurred while creating the guest link.:" + error
        );
      } finally {
        setLoading(false);
      }
    };
    createSharedLink();
  };

  const handleRecipeVisibilityChange = async (newIsPublic: boolean) => {
    setIsLoadingPrivacy(true);
    setIsPublic(newIsPublic);
    try {
      // Call the action to update recipe privacy
      // Assuming you have access to recipeId here
      const response = await updateRecipePrivacyAction(recipeId, newIsPublic);
      if (response.success) {
        toast.success("Recipe visibility updated successfully!");
      } else {
        toast.error("Failed to update recipe visibility.");
      }
    } catch (error) {
      toast.error("An error occurred while updating visibility: " + error);
    } finally {
      setIsLoadingPrivacy(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size={"icon-lg"} className={"rounded-full"}>
            <IconShare2 />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl w-[95%] p-0 gap-0 overflow-hidden">
        {/* Header Section */}
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-start gap-3 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center justify-center p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
            <IconShare2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-left">
            <DialogTitle className="text-lg">Share Recipe</DialogTitle>
            <DialogDescription className="truncate font-medium text-slate-500">
              {recipeName}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Tabs defaultValue="guest" className="w-full flex flex-col h-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="guest" className="flex items-center gap-2">
                <IconLink className="w-4 h-4" />
                <span>Guest Links</span>
              </TabsTrigger>
              <TabsTrigger
                value="visibility"
                className="flex items-center gap-2"
              >
                <IconWorld className="w-4 h-4" />
                <span>Visibility</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* FIX 1: Added 'flex flex-col' so the inner flex-1 works correctly */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <TabsContent
              value="guest"
              className="m-0 h-full max-h-[80vh] overflow-y-auto p-6 pt-4 outline-none"
            >
              {/* Guest Tab Content (Unchanged) */}
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center mb-4">
                    <IconCalendar className="w-4 h-4 mr-2 text-primary" />
                    Generate New Link
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["1 Day", "7 Days", "30 Days", "1 Year", "Custom"].map(
                      (duration) => (
                        <button
                          key={duration}
                          onClick={() => setSelectedExpiry(duration)}
                          className={`flex-1 min-w-[70px] px-2 py-2 text-xs font-medium rounded-lg border transition-all ${
                            selectedExpiry === duration
                              ? "bg-white border-primary text-primary shadow-sm ring-1 ring-primary/20 z-10"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                          }`}
                        >
                          {duration}
                        </button>
                      )
                    )}
                  </div>
                  {selectedExpiry === "Custom" && (
                    <div className="mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                        Select Expiration Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={today}
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none shadow-sm transition-all hover:border-slate-300"
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full shadow-sm bg-primary hover:bg-primary-dark text-white border-primary"
                    onClick={handleGenerate}
                    disabled={
                      (selectedExpiry === "Custom" && !customDate) || loading
                    }
                    size={"lg"}
                  >
                    <span>
                      {loading ? (
                        <IconLoader className="animate-spin" />
                      ) : (
                        "Create Guest Link"
                      )}
                    </span>
                  </Button>
                  <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
                    <IconInfoCircle className="w-3 h-3" />
                    {selectedExpiry === "Custom" && customDate
                      ? `Publically accessible via link until ${new Date(
                          customDate
                        ).toLocaleDateString()}`
                      : `Publically accessible via link for ${
                          selectedExpiry === "Custom"
                            ? "selected date"
                            : selectedExpiry
                        }`}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Active Links ({tokens.length})
                    </h3>
                  </div>
                  {tokens.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                      <p className="text-sm text-slate-400">
                        No active share links.
                      </p>
                    </div>
                  ) : (
                    tokens.map((token) => (
                      <div
                        key={token.id}
                        className="group border border-slate-100 rounded-xl bg-white hover:border-primary/20 hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-3 pl-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="bg-slate-100 p-2 rounded-lg shrink-0 group-hover:bg-primary/20 transition-colors">
                              <IconLink className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <div className="inline-flex items-center justify-center px-2 py-0 text-xs font-semibold text-slate-400 font-mono bg-slate-100 border border-slate-200 rounded-md">
                                {"..." + token.id.slice(-6)}
                              </div>
                              <div className="flex items-center text-[10px] text-slate-400 mt-0.5">
                                <IconClock className="w-3 h-3 mr-1" />
                                Expires:{" "}
                                {token.expiresAt
                                  ? new Date(
                                      token.expiresAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyToClipboard(
                                  `${baseShareUrl}${token.id}`,
                                  token.id
                                )
                              }
                              className="h-8 w-8 p-0 text-slate-500 hover:text-primary hover:bg-primary/10"
                            >
                              {copyStatus[token.id] ? (
                                <IconCheck className="w-4 h-4 text-green-600 scale-110" />
                              ) : (
                                <IconCopy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.share({
                                  title: recipeName,
                                  url: `${baseShareUrl}${token.id}`,
                                })
                              }
                              className="h-8 w-8 p-0 text-slate-500 hover:text-primary hover:bg-primary/10"
                            >
                              <IconShare2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(token.id)}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"
                              disabled={loadingShare?.tokenId === token.id}
                            >
                              <span>
                                {loadingShare?.tokenId === token.id ? (
                                  <IconLoader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <IconTrash className="w-4 h-4" />
                                )}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* FIX 2: Added 'm-0' to remove default tab margins and 'w-full' to constrain width */}
            <TabsContent
              value="visibility"
              className="m-0 w-full flex-1 overflow-y-auto p-6 pt-4 outline-none"
            >
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center mb-4">
                    <IconEye className="w-4 h-4 mr-2 text-primary" />
                    Visibility Status
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-xl transition-colors ${
                          isPublic ? "bg-primary/20" : "bg-slate-100"
                        }`}
                      >
                        {isPublic ? (
                          <IconWorld className="w-6 h-6 text-primary" />
                        ) : (
                          <IconLock className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {isPublic ? "Public Access" : "Private Access"}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isPublic
                            ? "Visible to anyone with the link"
                            : "Only visible to you"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRecipeVisibilityChange(!isPublic)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isPublic ? "bg-primary" : "bg-slate-300"
                      }`}
                      disabled={isLoadingPrivacy}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          isPublic ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isPublic && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center mb-3">
                      <IconLink className="w-4 h-4 mr-2 text-primary" />
                      Permanent Public Link
                    </h3>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 items-center w-full">
                      <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-xs text-slate-600 truncate font-mono shadow-sm">
                        {recipeUrl}
                      </div>

                      <Button
                        onClick={() =>
                          handleCopyToClipboard(recipeUrl, "public-link")
                        }
                        variant="default"
                        className="h-[38px] w-[38px] p-0 shadow-sm"
                      >
                        {copyStatus["public-link"] ? (
                          <IconCheck className="w-4 h-4 text-white" />
                        ) : (
                          <IconCopy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      How it works
                    </h3>
                  </div>
                  <div className="border border-slate-100 rounded-xl bg-white p-4">
                    <ul className="space-y-4">
                      {isPublic ? (
                        <>
                          <FeatureItem
                            icon={
                              <IconCheck className="w-3 h-3 text-primary" />
                            }
                            bg="bg-primary/20"
                          >
                            <span className="font-semibold text-slate-800">
                              No login required:
                            </span>{" "}
                            Anyone with the URL can view this recipe instantly.
                          </FeatureItem>
                          <FeatureItem
                            icon={<IconLink className="w-3 h-3 text-primary" />}
                            bg="bg-primary/20"
                          >
                            <span className="font-semibold text-slate-800">
                              Guest Links:
                            </span>{" "}
                            Guest Links will still work, even if the visibility
                            is changed to private.
                          </FeatureItem>
                          <FeatureItem
                            icon={
                              <IconWorld className="w-3 h-3 text-primary" />
                            }
                            bg="bg-primary/20"
                          >
                            <span className="font-semibold text-slate-800">
                              Global Access:
                            </span>{" "}
                            This recipe is visible to the public, may appear in
                            search results, and can be scraped by bots.
                          </FeatureItem>
                        </>
                      ) : (
                        <>
                          <FeatureItem
                            icon={
                              <IconLock className="w-3 h-3 text-slate-500" />
                            }
                            bg="bg-slate-100"
                          >
                            <span className="font-semibold text-slate-800">
                              Auth Required:
                            </span>{" "}
                            Users must log in to view this recipe.
                          </FeatureItem>
                          <FeatureItem
                            icon={
                              <IconLink className="w-3 h-3 text-slate-500" />
                            }
                            bg="bg-slate-100"
                          >
                            <span className="font-semibold text-slate-800">
                              Guest Links:
                            </span>{" "}
                            Guest Links will still work, even if the visibility
                            is changed to private.
                          </FeatureItem>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FeatureItem({
  icon,
  bg,
  children,
}: {
  icon: React.ReactNode;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start">
      <div className={`${bg} p-1 rounded-full mr-3 mt-0.5 shrink-0`}>
        {icon}
      </div>
      <p className="text-sm text-slate-600">{children}</p>
    </li>
  );
}
