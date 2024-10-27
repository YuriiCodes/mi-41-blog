"use client";

import { useState } from "react";
import Editor, { type ContentEditableEvent } from "react-simple-wysiwyg";
import { BlogContent } from "~/components/blog-content";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

enum pageMode {
  view = "view",
  edit = "edit",
}

export const EditorWYSIWYF = () => {
  const [html, setHtml] = useState("my <b>HTML</b>");
  const [mode, setMode] = useState<pageMode>(pageMode.edit);

  const onHtmlChange = (e: ContentEditableEvent) => {
    setHtml(e.target.value);
  };

  const onModeChange = () => {
    setMode((prevState) => {
      return prevState === pageMode.view ? pageMode.edit : pageMode.view;
    });
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Switch
          id="edit-mode"
          checked={mode === pageMode.edit}
          onClick={onModeChange}
        />
        <Label htmlFor="edit-mode">{mode}</Label>
      </div>

      {mode === pageMode.view ? (
        <BlogContent content={html} />
      ) : (
        <Editor value={html} onChange={onHtmlChange} />
      )}
    </div>
  );
};
