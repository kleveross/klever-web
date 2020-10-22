import _ from 'lodash';
import { Link } from 'umi';
import React from 'react';
import { Breadcrumb, Tooltip } from 'antd';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

interface Iprops {
  className: string;
  route: any;
}

function Breadcrumbs(props: any) {
  const { breadcrumbs } = props;
  const routes: Array<any> = [];
  _.forEach(breadcrumbs, breadcrumb => {
    const path = _.get(breadcrumb, 'key');
    const location = _.get(breadcrumb, 'location');
    const params = _.get(breadcrumb, 'match.params');
    const title = _.get(breadcrumb, 'component.title');
    _.isObject(title) && routes.push(title);
    _.isFunction(title) && routes.push(title(path, params, location));
  });

  return (
    <Breadcrumb className="klever-layout-breadcrumb">
      {_.map(routes, item => {
        const path = _.get(item, 'path');
        const title = _.get(item, 'name', '');
        const titleLength = title.length;
        const titleJSX =
          titleLength > 15 ? (
            <Tooltip title={title}>{title.substr(0, 15)}</Tooltip>
          ) : (
            title
          );

        return (
          <Breadcrumb.Item key={title}>
            {path ? <Link to={path}>{titleJSX}</Link> : titleJSX}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}

export default function(props: Iprops) {
  const { route } = props;
  const BreadcrumbsFN = withBreadcrumbs(route.routes)(Breadcrumbs);

  return <BreadcrumbsFN />;
}
