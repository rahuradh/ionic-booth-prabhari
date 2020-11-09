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
    path: 'home/:boothCode/:accessType/:phoneNo/:callFrom',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:boothCode/:accessType/:phoneNo/:callFrom',
    component: HomePage,
    children: [
      {
        path: 'search-page/:boothCode/:accessType/:phoneNo/:callFrom',
        loadChildren: () => import('./search-page/search-page.module').then(m => m.SearchPagePageModule)
      },
      {
        path: 'status-page/:boothCode/:accessType/:phoneNo/:callFrom',
        loadChildren: () => import('./status-page/status-page.module').then(m => m.StatusPagePageModule)
      },
      {
        path: 'filter-voter/:boothCode/:accessType/:phoneNo/:callFrom',
        loadChildren: () => import('./filter-voter/filter-voter.module').then(m => m.FilterVoterPageModule)
      },
    ]
  },
  {
    path: 'detail-page/:boothCode/:serialNo/:accessType/:phoneNo/:callFrom',
    loadChildren: () => import('./detail-page/detail-page.module').then(m => m.DetailPagePageModule)
  },
  {
    path: 'candidate-popover',
    loadChildren: () => import('./candidate-popover/candidate-popover.module').then(m => m.CandidatePopoverPageModule)
  },
  {
    path: 'candidate-page/:boothCode/:accessType/:phoneNo/:callFrom/:electionBody',
    loadChildren: () => import('./candidate-page/candidate-page.module').then(m => m.CandidatePagePageModule)
  },
  {
    path: 'candidate-detail/:boothCode/:accessType/:phoneNo/:callFrom/:electionBody/:candidateId/:candidatesCount',
    loadChildren: () => import('./candidate-detail/candidate-detail.module').then(m => m.CandidateDetailPageModule)
  },
  {
    path: 'message-sender/:boothCode/:serialNo/:accessType/:phoneNo/:callFrom',
    loadChildren: () => import('./message-sender/message-sender.module').then(m => m.MessageSenderPageModule)
  },
  {
    path: 'access-manager/:phoneNo',
    loadChildren: () => import('./access-manager/access-manager.module').then(m => m.AccessManagerPageModule)
  },
  {
    path: 'app-users-page/:phoneNo/:accessType/:accessCode',
    loadChildren: () => import('./app-users-page/app-users-page.module').then(m => m.AppUsersPagePageModule)
  },
  {
    path: 'app-user-detail-page/:phoneNo/:accessType/:accessCode/:userId',
    loadChildren: () => import('./app-user-detail-page/app-user-detail-page.module').then(m => m.AppUserDetailPagePageModule)
  },
  {
    path: 'change-password-page/:phoneNo',
    loadChildren: () => import('./change-password-page/change-password-page.module').then(m => m.ChangePasswordPagePageModule)
  },
  {
    path: 'audit-log/:phoneNo',
    loadChildren: () => import('./audit-log/audit-log.module').then(m => m.AuditLogPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }