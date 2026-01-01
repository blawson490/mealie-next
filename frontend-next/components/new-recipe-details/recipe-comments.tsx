"use client";

import { useState, useRef } from "react";
import { mediaApi } from "@/lib/api/media";
import { useAuth } from "@/lib/auth/auth-context";
import { RecipeCommentOut } from "@/lib/types/recipe";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconPhoto,
  IconMessage,
  IconRosetteDiscountCheckFilled,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import MealieMarkdown from "./mealie-markdown";

interface Props {
  comments?: RecipeCommentOut[];
}

export default function RecipeComments({ comments = [] }: Props) {
  const auth = useAuth();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper: Insert markdown syntax at cursor position
  const applyFormat = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = text;

    const selectedText = currentText.substring(start, end);
    const newText =
      currentText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentText.substring(end);

    setText(newText);
    textarea.focus();
  };

  return (
    <section className="w-full mx-auto bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <IconMessage size={22} stroke={1.5} />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Comments</h2>
            <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full font-bold">
              {comments.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-500 font-semibold text-[13px] cursor-pointer hover:text-slate-700 transition-colors">
          <span className="text-slate-300 text-lg mr-1">⇅</span> Most recent
        </div>
      </div>

      <div className="px-5 space-y-8">
        {/* Editor with Markdown Support */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-10 border border-transparent focus-within:border-slate-200 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Join the conversation..."
            className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 resize-none h-20 text-[15px]"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-slate-400 select-none">
              <button onClick={() => applyFormat("**", "**")} title="Bold">
                <IconBold
                  size={18}
                  className="cursor-pointer hover:text-slate-600"
                />
              </button>
              <button onClick={() => applyFormat("*", "*")} title="Italic">
                <IconItalic
                  size={18}
                  className="cursor-pointer hover:text-slate-600"
                />
              </button>
              <button
                onClick={() => applyFormat("<u>", "</u>")}
                title="Underline"
              >
                <IconUnderline
                  size={18}
                  className="cursor-pointer hover:text-slate-600"
                />
              </button>

              <div className="w-px h-4 bg-slate-300 mx-1" />

              {/* Header buttons */}
              <div className="flex items-center gap-2 text-xs font-bold font-mono">
                <button
                  onClick={() => applyFormat("# ")}
                  className="hover:text-slate-600 hover:bg-slate-200 px-1 rounded"
                >
                  H1
                </button>
                <button
                  onClick={() => applyFormat("## ")}
                  className="hover:text-slate-600 hover:bg-slate-200 px-1 rounded"
                >
                  H2
                </button>
                <button
                  onClick={() => applyFormat("### ")}
                  className="hover:text-slate-600 hover:bg-slate-200 px-1 rounded"
                >
                  H3
                </button>
              </div>

              <div className="w-px h-4 bg-slate-300 mx-1" />
              <IconPhoto
                size={18}
                className="cursor-pointer hover:text-slate-600"
              />
            </div>
            <button
              disabled={false}
              className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-slate-200"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="relative flex-shrink-0">
                <div className="h-11 w-11 rounded-full bg-slate-100 overflow-hidden ring-1 ring-slate-100">
                  <img
                    src={mediaApi.getUserProfileImage(comment.userId)}
                    alt={`${comment.user.fullName} profile image`}
                    className="h-full w-full object-cover"
                  />
                </div>
                {comment.user.admin && (
                  <div className="absolute bottom-0 -right-1 bg-white rounded-full p-[2px] shadow-sm z-10">
                    <IconRosetteDiscountCheckFilled
                      size={16}
                      className="text-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px] text-slate-900">
                      {comment.user.fullName}
                    </span>
                    <span className="text-[13px] text-slate-400 font-medium">
                      • {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  {(auth.user?.id === comment.userId || auth.user?.admin) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-slate-300 hover:text-slate-500 p-1 rounded outline-none">
                        <IconDotsVertical size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {/* 2. Owner-only: Edit Option */}
                        {auth.user?.id === comment.userId && (
                          <DropdownMenuItem>
                            <IconEdit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                        )}

                        {/* 3. Owner OR Admin: Delete Option */}
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          <IconTrash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <MealieMarkdown content={comment.text} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor(
    (now.getTime() - past.getTime()) / (1000 * 60)
  );
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const hours = Math.floor(diffInMinutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
