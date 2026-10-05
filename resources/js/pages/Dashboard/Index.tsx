import type { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Box,
    CheckCircle2,
    Clock3,
    FileText,
    Image,
    Plus,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import type { ComponentType } from 'react';
import { route } from 'ziggy-js';
import { AlertComponent } from '@/components/common/AlertComponent';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { formatDateTime } from '@/lib/formatDate';
import { ProductForm } from './Product/FormCreateEdit';
import { ProductCategoryForm } from './ProductCategory/FormCreateEdit';

interface DashboardStats {
    total_products: number;
    active_products: number;
    active_categories: number;
    missing_download_files: number;
}

interface NeedsAttention {
    missing_thumbnail: number;
    missing_download_file: number;
    missing_description: number;
    inactive_products: number;
}

interface LatestProduct {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    price: number;
    slug: string;
    description?: string;
    material: string;
    is_active: boolean;
    updated_at: string;
    images?: {
        id: number;
        image_path: string;
        image_url: string;
        is_thumbnail: boolean;
    }[];
    files?: {
        id: number;
        file_path: string;
        file_name: string;
        file_type: string;
        file_url: string;
        is_downloadable: boolean;
    }[];
    category: {
        id: number;
        name: string;
    } | null;
}

interface CategoryOption {
    id: number;
    parent_id: number | null;
    name: string;
    label: string;
}

interface DashboardProps {
    stats: DashboardStats;
    needsAttention: NeedsAttention;
    latestProducts: LatestProduct[];
    categories: CategoryOption[];
    categoryOptions: CategoryOption[];
}

const numberFormatter = new Intl.NumberFormat('id-ID');

function formatNumber(value: number) {
    return numberFormatter.format(value);
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    tone,
}: {
    title: string;
    value: number;
    description: string;
    icon: ComponentType<{ className?: string }>;
    tone: string;
}) {
    return (
        <Card size="sm">
            <CardContent className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-semibold">
                        {formatNumber(value)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}
                >
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    );
}

function AttentionRow({
    label,
    value,
    href,
    icon: Icon,
}: {
    label: string;
    value: number;
    href: string;
    icon: ComponentType<{ className?: string }>;
}) {
    const hasIssue = value > 0;

    return (
        <Link
            href={href}
            className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/60"
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                </div>
                <span className="truncate text-sm font-medium">{label}</span>
            </div>
            <Badge variant={hasIssue ? 'yellow' : 'green'}>
                {formatNumber(value)}
            </Badge>
        </Link>
    );
}

export default function Admin({
    stats,
    needsAttention,
    latestProducts,
    categories,
    categoryOptions,
}: DashboardProps) {
    const { flash } = usePage<PageProps>().props;
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<
        LatestProduct | undefined
    >();

    const openCreateProductModal = () => {
        setSelectedProduct(undefined);
        setShowProductModal(true);
    };

    const openEditProductModal = (product: LatestProduct) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        setSelectedProduct(undefined);
    };
    const closeCategoryModal = () => setShowCategoryModal(false);

    return (
        <DashboardLayout className="min-h-0 gap-4">
            {flash && (
                <AlertComponent
                    title={flash.message}
                    variant={flash.type}
                    className="col-span-4 mb-4"
                />
            )}

            <div className="col-span-4 flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Catalog summary
                    </p>
                    <h2 className="text-lg font-semibold">
                        Monitor products, categories, and data completeness.
                    </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={openCreateProductModal}>
                        <Plus />
                        Product
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        <Plus />
                        Category
                    </Button>
                </div>
            </div>

            <div className="col-span-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Products"
                    value={stats.total_products}
                    description="All catalog products"
                    icon={Box}
                    tone="bg-sky-100 text-sky-700"
                />
                <StatCard
                    title="Active Products"
                    value={stats.active_products}
                    description="Shown in the main catalog"
                    icon={CheckCircle2}
                    tone="bg-emerald-100 text-emerald-700"
                />
                <StatCard
                    title="Active Categories"
                    value={stats.active_categories}
                    description="Ready to be used by products"
                    icon={Tag}
                    tone="bg-violet-100 text-violet-700"
                />
                <StatCard
                    title="Missing Files"
                    value={stats.missing_download_files}
                    description="No download file yet"
                    icon={FileText}
                    tone="bg-amber-100 text-amber-700"
                />
            </div>

            <Card className="col-span-4 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Needs Attention</CardTitle>
                    <CardDescription>
                        Catalog data that needs attention.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AttentionRow
                        label="Products without a thumbnail"
                        value={needsAttention.missing_thumbnail}
                        href={route('dashboard.product')}
                        icon={Image}
                    />
                    <AttentionRow
                        label="Products without a download file"
                        value={needsAttention.missing_download_file}
                        href={route('dashboard.product-files')}
                        icon={FileText}
                    />
                    <AttentionRow
                        label="Products without a description"
                        value={needsAttention.missing_description}
                        href={route('dashboard.product')}
                        icon={AlertTriangle}
                    />
                    <AttentionRow
                        label="Inactive products"
                        value={needsAttention.inactive_products}
                        href={route('dashboard.product')}
                        icon={Clock3}
                    />
                </CardContent>
            </Card>

            <Card className="col-span-4 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Latest Products</CardTitle>
                    <CardDescription>
                        The last five products that were updated.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {latestProducts.length > 0 ? (
                        <div className="space-y-3">
                            {latestProducts.map((product) => (
                                <div
                                    key={product.id}
                                    role="button"
                                    tabIndex={0}
                                    className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                    onClick={() =>
                                        openEditProductModal(product)
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === ' '
                                        ) {
                                            event.preventDefault();
                                            openEditProductModal(product);
                                        }
                                    }}
                                >
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <p className="truncate text-sm font-medium">
                                                {product.name}
                                            </p>
                                            <Badge
                                                variant={
                                                    product.is_active
                                                        ? 'green'
                                                        : 'outline'
                                                }
                                            >
                                                {product.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {product.sku} -{' '}
                                            {product.category?.name ||
                                                'No category'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDateTime(product.updated_at)}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Edit ${product.name}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openEditProductModal(product);
                                        }}
                                    >
                                        <ArrowRight />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                            No products yet.
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={showProductModal}
                onOpenChange={(open) => {
                    if (!open) {
                        closeProductModal();
                    } else {
                        setShowProductModal(true);
                    }
                }}
            >
                <AlertDialogContent
                    className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-2xl!"
                    scrollable={false}
                    overlayProps={{ onClick: closeProductModal }}
                >
                    <AlertDialogHeader className="shrink-0 place-items-start text-left">
                        <AlertDialogTitle>
                            {selectedProduct
                                ? 'Edit Product'
                                : 'Create Product'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedProduct
                                ? 'Update product data.'
                                : 'Add a new product to the catalog.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ProductForm
                        product={selectedProduct}
                        categories={categories}
                        onCancel={closeProductModal}
                        onSuccess={closeProductModal}
                    />
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={showCategoryModal}
                onOpenChange={(open) => {
                    if (!open) {
                        closeCategoryModal();
                    } else {
                        setShowCategoryModal(true);
                    }
                }}
            >
                <AlertDialogContent
                    className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-xl"
                    scrollable={false}
                    overlayProps={{ onClick: closeCategoryModal }}
                >
                    <AlertDialogHeader className="shrink-0 place-items-start text-left">
                        <AlertDialogTitle>
                            Create Product Category
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Add a new category for catalog products.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ProductCategoryForm
                        categories={categoryOptions}
                        onCancel={closeCategoryModal}
                        onSuccess={closeCategoryModal}
                    />
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
