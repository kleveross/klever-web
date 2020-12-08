import _ from 'lodash';
import { request } from 'umi';

export async function CreateProject(name: string) {
  return request('/api/v2.0/projects', {
    method: 'post',
    data: {
      project_name: name,
      metadata: {
        public: 'true',
      },
    },
  });
}

export async function ListProjects(params: {
  current: number;
  pageSize: number;
  gender?: string;
}) {
  const { current: page, pageSize: page_size } = params;
  return request('/api/v2.0/projects', {
    params: {
      page,
      page_size,
    },
  });
}

export async function ProjectsInfo() {
  return request('/api/v2.0/statistics');
}

export async function GetProject(params: {
  current: number;
  pageSize: number;
  name: string;
  gender?: string;
}) {
  const { current: page, pageSize: page_size, name } = params;
  return request(`/api/v2.0/projects/${name}/repositories`, {
    params: {
      page,
      page_size,
    },
  });
}

export async function VersionsInfo(id: string) {
  return request(`/api/v2.0/projects/${id}`);
}

export async function ListVersions(params: {
  current: number;
  pageSize: number;
  query?: string;
  name: string;
  model: string;
  gender?: string;
}) {
  const {
    query = '',
    current: page,
    pageSize: page_size,
    name,
    model,
  } = params;
  return request(`/api/v2.0/projects/${name}/repositories/${model}/artifacts`, {
    params: {
      page,
      page_size,
      q: query,
    },
  });
}

export async function VersionInfo(project_id: string, name: string) {
  return request(`/api/v2.0/projects/${project_id}/repositories/${name}`);
}

export async function GetVersion(params: {
  name: string;
  model: string;
  digest: string;
}) {
  const { name, model, digest } = params;
  return request(
    `/api/v2.0/projects/${name}/repositories/${model}/artifacts/${digest}`,
    {
      params: {
        with_signature: true,
        with_scan_overview: true,
        with_label: true,
      },
    },
  );
}

type ModelJobParam = {
  name: string;
  version: string;
};

export async function CreateModelJob(from: ModelJobParam, to: ModelJobParam) {
  return request('/api/v1alpha1/namespaces/default/modeljobs', {
    method: 'post',
    data: {
      apiVersion: 'kleveross.io/v1alpha1',
      kind: 'ModelJob',
      metadata: {
        namespace: 'default',
      },
      spec: {
        conversion: {
          mmdnn: {
            from: from.name,
            to: to.name,
          },
        },
        model: `harbor-harbor-core.harbor-system/release/${_.toLower(
          from.name,
        )}:${from.version}`,
        desiredTag: `harbor-harbor-core.harbor-system/release/${_.toLower(
          to.name,
        )}:${to.version}`,
      },
    },
  });
}

export async function ListModelJobs(params: {
  current: number;
  pageSize: number;
  type: string;
}) {
  const { type, current, pageSize: limit } = params;
  return request('/api/v1alpha1/namespaces/default/modeljobs', {
    params: {
      filter: `modeljob/${type}`,
      start: current - 1,
      limit,
    },
  });
}

export async function GetModelJob(name: string) {
  return request(`/api/v1alpha1/namespaces/default/modeljobs/${name}`);
}
