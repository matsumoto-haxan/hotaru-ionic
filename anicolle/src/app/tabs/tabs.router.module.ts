import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'collect',
                children: [
                    {
                        path: '',
                        loadChildren: '../collect/collect.module#CollectPageModule'
                    }
                ]
            },
            {
                path: 'fieldmap',
                children: [
                    {
                        path: '',
                        loadChildren: '../fieldmap/fieldmap.module#FieldmapPageModule'
                    }
                ]
            },
            {
                path: 'mypage',
                children: [
                    {
                        path: '',
                        loadChildren: '../mypage/mypage.module#MypagePageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/fieldmap',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/tabs/fieldmap',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TabsPageRoutingModule { }