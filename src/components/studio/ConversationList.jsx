import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ConversationList({ conversations, activeConversation, onSelect }) {
  return (
    <div className="p-2">
      {conversations.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-2">No campaigns yet</p>
          <p className="text-xs text-gray-500">Start your first campaign to get going</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((convo) => {
            const isActive = activeConversation?.id === convo.id;
            const lastMessage = convo.messages?.[convo.messages.length - 1];
            
            return (
              <button
                key={convo.id}
                onClick={() => onSelect(convo)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 shadow-sm"
                    : "hover:bg-gray-50 border border-transparent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    isActive
                      ? "bg-gradient-to-br from-purple-500 to-pink-500"
                      : "bg-gray-100"
                  )}>
                    <Sparkles className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-gray-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium text-sm truncate",
                      isActive ? "text-purple-900" : "text-gray-900"
                    )}>
                      {convo.metadata?.name || `Campaign ${convo.id.slice(0, 8)}`}
                    </h3>
                    {lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {lastMessage.content?.slice(0, 40)}...
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(convo.created_date), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}