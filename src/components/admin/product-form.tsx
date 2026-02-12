import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm({
  action,
  submitLabel,
  defaultValues,
  errorMessage
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: {
    name?: string;
    price?: string;
    description?: string;
    imageUrl?: string;
    fit?: string;
    gsm?: string;
    fabric?: string;
    status?: "draft" | "published";
  };
  errorMessage?: string | null;
}) {
  return (
    <form action={action} className="space-y-5" encType="multipart/form-data">
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Thirtee6 Oversized Tee"
            defaultValue={defaultValues?.name ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            placeholder="e.g. 79.99"
            inputMode="decimal"
            defaultValue={defaultValues?.price ?? ""}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="fit">Fit</Label>
          <Input id="fit" name="fit" placeholder="e.g. oversized, boxy" defaultValue={defaultValues?.fit ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gsm">GSM</Label>
          <Input
            id="gsm"
            name="gsm"
            placeholder="e.g. 240"
            inputMode="numeric"
            defaultValue={defaultValues?.gsm ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fabric">Fabric</Label>
          <Input id="fabric" name="fabric" placeholder="e.g. 100% cotton" defaultValue={defaultValues?.fabric ?? ""} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status ?? "draft"}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-slate-900/10 focus:border-slate-300 focus:ring-4"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="imageFile">Product image</Label>
          <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
          <p className="text-xs text-slate-500">
            Upload a square or 4:5 image. On edit, leave empty to keep the current image.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (optional)</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://..."
            defaultValue={defaultValues?.imageUrl ?? ""}
          />
          <p className="text-xs text-slate-500">If you upload a file, the URL will be replaced automatically.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Write a short description..."
          defaultValue={defaultValues?.description ?? ""}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

