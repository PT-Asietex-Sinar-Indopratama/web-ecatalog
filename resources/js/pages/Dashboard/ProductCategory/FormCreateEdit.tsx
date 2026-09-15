import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link, useForm } from "@inertiajs/react";
import { ChevronLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { route } from "ziggy-js";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Field, FieldLabel,
} from "@/components/ui/field";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface Props {
  category?: Category;
}

export default function FormCreateEdit({ category }: Props) {

  const isEdit = !!category;

  const breadcrumbs = [
    {
      label: "Product Category",
      url: route("dashboard.product-category"),
    },
    {
      label: isEdit
        ? "Edit Product Category"
        : "Create Product Category",
      url: isEdit
        ? route("dashboard.product-category.edit", category.id)
        : route("dashboard.product-category.create"),
    },
  ];

  const items = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  const {
    data, setData, post, put, processing, errors,
  } = useForm({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    is_active: category
      ? category.is_active ? "1" : "0"
      : "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      put(route("dashboard.product-category.update", category.id));
    } else {
      post(route("dashboard.product-category.store"));
    }
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>

      <form onSubmit={submit} className="col-span-4 grid grid-cols-8 space-y-4 gap-4 [&_div]:mb-0" >

        {/* FORM CARD */}
        <Card className="col-span-8 md:col-span-3">
          <CardContent className="flex flex-col gap-4">

            {/* NAME */}
            <Field>
              <FieldLabel htmlFor="name">
                Name{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>

              <Input id="name" type="text" value={data.name} onChange={(e) => setData("name", e.target.value)} required />

              {errors.name && (<p className="text-sm text-red-500"> {errors.name} </p>)}
            </Field>

            {/* SLUG */}
            <Field>
              <FieldLabel htmlFor="slug">
                Slug{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>

              <Input id="slug" type="text" value={data.slug} onChange={(e) => setData("slug", e.target.value)} required />

              {errors.slug && (<p className="text-sm text-red-500"> {errors.slug} </p>)}
            </Field>

            {/* DESCRIPTION */}
            <Field>
              <FieldLabel htmlFor="description">
                Description{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>

              <Textarea id="description" value={data.description} onChange={(e) => setData("description", e.target.value)} required />

              {errors.description && (<p className="text-sm text-red-500"> {errors.description} </p>)}
            </Field>

            {/* STATUS */}
            <Field>
              <FieldLabel htmlFor="is_active">
                Status{" "}
                <span className="text-destructive">*</span>
              </FieldLabel>

              <Select value={data.is_active} onValueChange={(value) => setData("is_active", value ?? "")} required >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>

                    <SelectLabel>
                      Status
                    </SelectLabel>

                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}> {item.label} </SelectItem>
                    ))}

                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.is_active && (<p className="text-sm text-red-500"> {errors.is_active} </p>)}
            </Field>

          </CardContent>
        </Card>

        <div className="col-span-8 md:col-span-5" />

        {/* BUTTONS */}
        <div className="col-span-8 md:col-span-3 mt-5 flex justify-end gap-2">
          <Link href={route("dashboard.product-category")} >
            <Button type="button" variant="secondary" disabled={processing} className="w-fit" >
              <ChevronLeft /> Back
            </Button>
          </Link>

          <Button type="submit" disabled={processing} className="w-30" >
            <Save /> {isEdit ? "Update" : "Create"}
          </Button>
        </div>

      </form>

    </DashboardLayout>
  );
}