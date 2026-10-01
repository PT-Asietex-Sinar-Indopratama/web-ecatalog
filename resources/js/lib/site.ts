import {
    Box,
    FileText,
    Image,
    PanelsTopLeft,
    Tag,
    UserCog,
    Users,
} from 'lucide-react';
import { NavUser } from '@/components/common/NavUser';

export const site = {
    navMain: [
        {
            label: 'Menu',
            items: [
                {
                    title: 'Dashboard',
                    url: 'dashboard.main',
                    icon: PanelsTopLeft,
                },
            ],
        },
        {
            label: 'Master Data',
            items: [
                {
                    title: 'Product',
                    url: 'dashboard.product',
                    icon: Box,
                },
                {
                    title: 'Product Category',
                    url: 'dashboard.product-category',
                    icon: Tag,
                },
                {
                    title: 'Product Images',
                    url: 'dashboard.product-images',
                    icon: Image,
                },
                {
                    title: 'Product Files',
                    url: 'dashboard.product-files',
                    icon: FileText,
                },
            ],
        },
        {
            label: 'User Management',
            items: [
                {
                    title: 'User',
                    url: 'dashboard.user',
                    icon: Users,
                },
                {
                    title: 'User Role',
                    url: 'dashboard.user-role',
                    icon: UserCog,
                },
            ],
        },
        // {
        //   label: "Example Group",
        //   items: [
        //     {
        //       title: "Playground",
        //       url: "#",
        //       icon: TerminalSquareIcon,
        //       isActive: true,
        //       items: [
        //         {
        //           title: "History",
        //           url: "#",
        //         },
        //       ],
        //     },
        //   ],
        // },
    ],

    sidebarFooter: {
        component: NavUser,
    },
};
