workflow "Preview Build on PR" {
  on = "pull_request"
  resolves = ["Build Storybook"]
}

action "Install" {
  uses = "borales/actions-yarn@master"
  args = "install"
  env = {
    CI = "true"
  }
}

action "Build Storybook" {
  needs = ["Install"]
  uses = "borales/actions-yarn@master"
  args = "build-storybook"
  env = {
    CI = "true"
  }
}
