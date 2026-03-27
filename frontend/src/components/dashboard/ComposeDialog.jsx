import React, { useEffect } from 'react';
import FileEdit from 'lucide-react/dist/esm/icons/file-edit.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import { Button } from '@/components/ui/button';

export function ComposeDialog({ open, onOpenChange, role }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  const title = role === 'student' ? 'Write Article' : 'Create Post';
  const description =
    role === 'student'
      ? 'Draft an article, mentorship note, or job insight for the community.'
      : 'Start a new alumni update, opportunity drop, or community story.';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close compose modal"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 w-full max-w-xl rounded-lg border border-[#2A2940] bg-[#1A1925] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="auth-pill bg-[#6C63FF]/10 text-[#6C63FF]">
              <FileEdit className="h-3.5 w-3.5" />
              Compose
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[#E8E6F0]">
              {title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#9694A8]">{description}</p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#2A2940] bg-[#0F0E17] text-[#9694A8] transition hover:bg-[#242336] hover:text-[#E8E6F0]"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-[#2A2940] bg-[#0F0E17] p-4">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-[#5D5B71]">Preview</div>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Write a title"
              className="auth-input"
            />
            <textarea
              rows={6}
              placeholder="Share something meaningful with the network..."
              className="auth-input min-h-[144px] resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            className="auth-btn-secondary h-10 px-5"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="auth-btn-primary h-10 px-5">
            Save Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
