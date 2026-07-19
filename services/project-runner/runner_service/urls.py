from django.urls import path

from runner_service.views import (
    build_project,
    cleanup_project,
    health,
    input_project_process,
    list_project_fs,
    list_projects,
    poll_project_process,
    prepare_project,
    read_project_file,
    resize_project_process,
    run_project,
    start_project_process,
)

urlpatterns = [
    path("health", health),
    path("projects", list_projects),
    path("projects/prepare", prepare_project),
    path("projects/fs/list", list_project_fs),
    path("projects/fs/read", read_project_file),
    path("projects/build", build_project),
    path("projects/run", run_project),
    path("projects/process/start", start_project_process),
    path("projects/process/poll", poll_project_process),
    path("projects/process/input", input_project_process),
    path("projects/process/resize", resize_project_process),
    path("projects/cleanup", cleanup_project),
]
