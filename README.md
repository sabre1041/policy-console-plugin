# OpenShift Policy Console Plugin

OpenShift [Dynamic Console Plugin](https://docs.openshift.com/container-platform/4.10/web_console/dynamic-plug-ins.html) that exposes policy management tools.

Supported tools:

* [Kyverno](https://kyverno.io/)

## Deployment to a Cluster

Use the following steps to deploy the plugin to your OpenShift Cluster.

An OpenShift template ([template.yaml](template.yaml)) has been provided to deploy the plugin to an OpenShift cluster.

The following parameters are required:

* `NAMESPACE` - The name of the namespace that should be created and where the plugin should be deployed
* `IMAGE` - The location of the image containing the plugin

```shell
oc process -f template.yaml \
  -p NAMESPACE=policy-console-plugin \
  -p IMAGE=quay.io/ablock/policy-console-plugin:latest \
  | oc create -f -
```

Once deployed, patch the
[Console operator](https://github.com/openshift/console-operator)
config to enable the plugin.

```shell
oc patch consoles.operator.openshift.io cluster \
  --patch '{ "spec": { "plugins": ["policy-console-plugin"] } }' --type=merge
```

The plugin becomes activated as soon as one of the supported tools is available in the cluster. A _Policies_ tab will be available on the Administrator perspective of the OpenShift Console.

## Development

### Option 1: Local

In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login` (requires [oc](https://console.redhat.com/openshift/downloads) and an [OpenShift cluster](https://console.redhat.com/openshift/create))
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io))

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000/example> to see the running plugin.

#### Running start-console with Apple silicon and podman

If you are using podman on a Mac with Apple silicon, `yarn run start-console`
might fail since it runs an amd64 image. You can workaround the problem with
[qemu-user-static](https://github.com/multiarch/qemu-user-static) by running
these commands:

```bash
podman machine ssh
sudo -i
rpm-ostree install qemu-user-static
systemctl reboot
```

### Option 2: Docker + VSCode Remote Container

Make sure the
[Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
extension is installed. This method uses Docker Compose where one container is
the OpenShift console and the second container is the plugin. It requires that
you have access to an existing OpenShift cluster. After the initial build, the
cached containers will help you start developing in seconds.

1. Create a `dev.env` file inside the `.devcontainer` folder with the correct values for your cluster:

```bash
OC_PLUGIN_NAME=my-plugin
OC_URL=https://api.example.com:6443
OC_USER=kubeadmin
OC_PASS=<password>
```

2. `(Ctrl+Shift+P) => Remote Containers: Open Folder in Container...`
3. `yarn run start`
4. Navigate to <http://localhost:9000/example>

## Docker image

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:

   ```sh
   docker build -t quay.io/my-repositroy/my-plugin:latest .
   ```

2. Run the image:

   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/my-repository/my-plugin:latest
   ```

3. Push the image:

   ```sh
   docker push quay.io/my-repository/my-plugin:latest
   ```

NOTE: If you have a Mac with Apple silicon, you will need to add the flag
`--platform=linux/amd64` when building the image to target the correct platform
to run in-cluster.
