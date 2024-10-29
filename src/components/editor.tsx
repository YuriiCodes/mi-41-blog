"use client";

import { FC, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogContent } from "~/components/blog-content";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


enum pageMode {
  view = "view",
  edit = "edit",
}

const MS_TO_REDIRECT = 2000;
const msToSeconds = (ms: number) => ms / 1000;

const formSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  brief: z
    .string()
    .min(1, "Brief is required")
    .max(150, "Brief cannot exceed 150 characters"),
  content: z.string().min(1, "Content is required"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  userId: string;
};
export const EditorWYSIWYF: FC<Props> = ({ userId }) => {
  const [mode, setMode] = useState<pageMode>(pageMode.edit);
  const router = useRouter();
  const { mutateAsync } = api.post.create.useMutation({
    onSuccess: ({ slug }) => {
      const url = `/read/${slug}`;
      router.prefetch(url);
      setTimeout(() => {
        void router.push(`/read/${slug}`);
      }, MS_TO_REDIRECT);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      brief: "",
      content: "My <b>blog post</b>", // Initial content
    },
  });

  const onSubmit = async (data: FormData) => {
    const promise = mutateAsync({
      ...data,
      isPublished: true,
      userId,
    });

    void toast.promise(promise, {
      success: `Saved successfully. You will be redirected after ${msToSeconds(MS_TO_REDIRECT)} seconds`,
      error: "Error saving",
      loading: "Saving...",
    });
  };

  const onModeChange = () => {
    setMode((prevState) => {
      return prevState === pageMode.view ? pageMode.edit : pageMode.view;
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-center space-x-2">
        <Switch
          id="edit-mode"
          checked={mode === pageMode.edit}
          onClick={onModeChange}
        />
        <Label htmlFor="edit-mode">{mode}</Label>
      </div>

      {mode === pageMode.view ? (
        <BlogContent content={getValues("content")} isShowComments={false}/>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid w-full items-center gap-1.5"
        >
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" type="text" {...register("slug")} />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

          <Label htmlFor="title">Title</Label>
          <Input id="title" type="text" {...register("title")} />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Label htmlFor="brief">Brief</Label>
          <Input id="brief" type="text" {...register("brief")} />
          {errors.brief && (
            <p className="text-red-500">{errors.brief.message}</p>
          )}

          <Label htmlFor="content">Content</Label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Editor
                id="content"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}

          <Button type="submit">Save</Button>
        </form>
      )}
    </div>
  );
};
