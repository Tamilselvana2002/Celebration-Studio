from django.urls import path
from . import views

urlpatterns = [
    # Marketing & Core Dashboards
    path('', views.LandingView.as_view(), name='landing'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('templates/', views.TemplateGalleryView.as_view(), name='template_gallery'),
    path('create/', views.WizardCreateView.as_view(), name='wizard_create'),

    # Creator Authentication Portal (Fully Animated)
    path('login/', views.CreatorLoginView.as_view(), name='login'),
    path('register/', views.CreatorRegisterView.as_view(), name='register'),
    path('logout/', views.CreatorLogoutView.as_view(), name='logout'),

    # Password Reset & Recovery (Gmail SMTP Flow)
    path('password-reset/', views.CustomPasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', views.CustomPasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset-password/<uidb64>/<token>/', views.CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset-password/complete/', views.CustomPasswordResetCompleteView.as_view(), name='password_reset_complete'),

    # Experience Studio & Viewports
    path('celebrations/<uuid:celebration_id>/edit/', views.ExperienceStudioView.as_view(), name='experience_studio'),
    path('celebrations/<uuid:celebration_id>/preview/', views.CelebrationPreviewView.as_view(), name='celebration_preview'),
    
    # Public Celebration Experience
    path('c/<slug:slug>/', views.PublicCelebrationView.as_view(), name='public_celebration'),

    # Directories & Management
    path('recipients/', views.RecipientDirectoryView.as_view(), name='recipient_directory'),
    path('media-vault/', views.MediaVaultView.as_view(), name='media_vault'),

    # API Endpoints
    path('celebrations/<uuid:celebration_id>/update-theme/', views.UpdateThemeAPI.as_view(), name='api_update_theme'),
    path('celebrations/<uuid:celebration_id>/publish-toggle/', views.PublishToggleAPI.as_view(), name='api_publish_toggle'),
    path('celebrations/<uuid:celebration_id>/scenes/<uuid:scene_id>/update/', views.UpdateSceneContentAPI.as_view(), name='api_update_scene_content'),
    path('celebrations/<uuid:celebration_id>/reorder-scenes/', views.ReorderScenesAPI.as_view(), name='api_reorder_scenes'),
    path('celebrations/<uuid:celebration_id>/add-scene/', views.AddSceneAPI.as_view(), name='api_add_scene'),
    path('celebrations/<uuid:celebration_id>/scenes/<uuid:scene_id>/delete/', views.DeleteSceneAPI.as_view(), name='api_delete_scene'),
    path('celebrations/<uuid:celebration_id>/upload-photo/', views.UploadPhotoAPI.as_view(), name='api_upload_photo'),
    path('celebrations/<uuid:celebration_id>/update-animations/', views.UpdateAnimationConfigAPI.as_view(), name='api_update_animations'),
    path('celebrations/<uuid:celebration_id>/upload-audio/', views.UploadAudioAPI.as_view(), name='api_upload_audio'),
    path('celebrations/<uuid:celebration_id>/update-audio/', views.UpdateAudioConfigAPI.as_view(), name='api_update_audio'),

    # Master Admin Command Center (Strictly Protected)
    path('master-admin/', views.MasterAdminDashboardView.as_view(), name='master_admin_dashboard'),
    path('master-admin/create-admin/', views.MasterAdminCreateAdminView.as_view(), name='master_admin_create_admin'),
    path('master-admin/users/<int:user_id>/toggle-admin/', views.MasterAdminToggleAdminView.as_view(), name='master_admin_toggle_admin'),
    path('master-admin/celebrations/<uuid:celebration_id>/delete/', views.MasterAdminDeleteCelebrationView.as_view(), name='master_admin_delete_celebration'),
]
