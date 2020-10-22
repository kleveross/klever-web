import _ from 'lodash';
import { request } from 'umi';

const namespace = 'kleveross-system';

export async function CreateServing(values: {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: 'kleveross-system';
  };
  spec: any;
}) {
  return request(`/api/v1alpha1/namespaces/${namespace}/servings`, {
    method: 'post',
    data: values,
  });
}

export async function ListServings(params: {
  current: number;
  pageSize: number;
  gender?: string;
}) {
  const { current: page, pageSize: page_size } = params;
  return request(`/api/v1alpha1/namespaces/${namespace}/servings`, {
    params: {
      page,
      page_size,
    },
  });
}

export async function GetServing(namespace: string, name: string) {
  return request(`/api/v1alpha1/namespaces/${namespace}/servings/${name}`);
}
