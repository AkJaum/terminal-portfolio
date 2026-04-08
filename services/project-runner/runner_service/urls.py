from django.urls import path

from runner_service.views import (
    build_project,
    cleanup_project,
    health,
    list_project_fs,
    list_projects,
    prepare_project,
    read_project_file,
    run_project,
)

urlpatterns = [
    path("health", health),
    path("projects", list_projects),
    path("projects/prepare", prepare_project),
    path("projects/fs/list", list_project_fs),
    path("projects/fs/read", read_project_file),
    path("projects/build", build_project),
    path("projects/run", run_project),
    path("projects/cleanup", cleanup_project),
]
