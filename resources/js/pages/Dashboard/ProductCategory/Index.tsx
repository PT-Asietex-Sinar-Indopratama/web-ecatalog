import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { Link, router, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertComponent } from "@/components/common/AlertComponent";
import { DataTable } from "@/components/common/DataTable";
import { DataPagination } from "@/components/common/DataPagination";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusFilter } from "@/components/common/StatusFilter";
import { ActionDropdown } from "@/components/common/ActionDropdown";

import type { PageProps } from "@inertiajs/core";
import type { Paginated } from "@/types";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

interface FilterProps {
  search?: string;
  status?: string;
}

export default function ProductCategory({
  category,
  filters = {},
}: {
  category: Paginated<Category>;
  filters?: FilterProps;
}) {
  const { flash } = usePage<PageProps>().props;

  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");

  const handleFilter = (newSearch: string, newStatus: string) => {
    const query: Record<string, string> = {};
    if (newSearch) query.search = newSearch;
    if (newStatus && newStatus !== "all") query.status = newStatus;

    router.get(route("dashboard.product-category"), query, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    handleFilter(newSearch, status);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    handleFilter(search, newStatus);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    handleFilter("", "all");
  };

  const breadcrumbs = [

    {
      label: "Product Category",
      url: route("dashboard.product-category"),
    },
  ];

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = [
    {
      key: "action",
      header: "Action",
      sortable: false,
      cell: (item: Category) => (
        <ActionDropdown
          onEdit={() =>
            router.visit(route("dashboard.product-category.edit", item.id))
          }
          onDelete={() =>
            router.delete(
              route("dashboard.product-category.destroy", item.id)
            )
          }
          deleteTitle="Delete Confirmation"
          deleteDescription={`Are you sure you want to delete "${item.name}" ?`}
        />
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "description",
      header: "Description",
      sortable: true,
    },
    {
      key: "is_active",
      header: "Status",
      sortable: true,
      cell: (item: Category) =>
        item.is_active ? (
          <Badge variant="green">Active</Badge>
        ) : (
          <Badge variant="yellow">Inactive</Badge>
        ),
    },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {flash && (
        <AlertComponent
          title={flash.message}
          variant={flash.type}
          className="col-span-4 mb-4"
        />
      )}

      <div className="col-span-4 space-y-4">
        <Card>
          <CardContent>
            {/* ADD SECTION */}
            <div className="flex justify-end mb-4">
              <Link href={route("dashboard.product-category.create")}>
                <Button>
                  <Plus /> Add Data
                </Button>
              </Link>
            </div>

            {/* FILTER SECTION */}
            <div className="flex items-center gap-4 mb-4">
              <SearchInput
                value={search}
                onSearch={handleSearch}
                placeholder="Search"
              />

              <StatusFilter
                value={status}
                onChange={handleStatusChange}
              />

              {(search !== "" || status !== "all") && (
                <Button variant="secondary" onClick={handleReset}>
                  <RotateCcw />
                  <span className="hidden sm:inline-block">
                    Reset
                  </span>
                </Button>
              )}
            </div>

            {/* TABLE */}
            <DataTable data={category.data} columns={columns} />
          </CardContent>
        </Card>

        {/* PAGINATION */}
        <DataPagination meta={category} />
      </div>
    </DashboardLayout>
  );
}