import { HomePage } from './home/home.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'dashboard/:phoneNo',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'access-page/:isAdminApproved/:isPaymentSuccess/:phoneNo',
    loadChildren: () => import('./access-page/access-page.module').then(m => m.AccessPagePageModule)
  },
  {
    path: 'home/:boothCode/:accessType',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:boothCode/:accessType',
    component: HomePage,
    children: [
      {
        path: 'search-page/:boothCode/:accessType',
        loadChildren: () => import('./search-page/search-page.module').then(m => m.SearchPagePageModule)
      },
      {
        path: 'status-page/:boothCode/:accessType',
        loadChildren: () => import('./status-page/status-page.module').then(m => m.StatusPagePageModule)
      },
      {
        path: 'filter-voter/:boothCode/:accessType',
        loadChildren: () => import('./filter-voter/filter-voter.module').then(m => m.FilterVoterPageModule)
      },
    ]
  },
  {
    path: 'detail-page/:boothCode/:serialNo/:accessType/:callFrom',
    loadChildren: () => import('./detail-page/detail-page.module').then(m => m.DetailPagePageModule)
  },
  {
    path: 'candidate-page/:boothCode/:electionBody',
    loadChildren: () => import('./candidate-page/candidate-page.module').then(m => m.CandidatePagePageModule)
  },
  {
    path: 'candidate-popover',
    loadChildren: () => import('./candidate-popover/candidate-popover.module').then(m => m.CandidatePopoverPageModule)
  },
  {
    path: 'candidate-detail/:candidateId/:boothCode/:electionBody',
    loadChildren: () => import('./candidate-detail/candidate-detail.module').then(m => m.CandidateDetailPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }