import React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

export default function PaginationLink({ pages }) {
  return (
    <Route>
      {({ location }) => {
        const query = new URLSearchParams(location.search);
        const page = parseInt(query.get('page') || '1', 10);
        return (
          <Pagination
            page={page}
            count={pages}
            renderItem={(item) => {
              item.page === 1 ? query.delete('page') : query.set('page', item.page);
              return <PaginationItem component={Link} to={{ search: `?${query.toString()}` }} {...item} />;
            }}
          />
        );
      }}
    </Route>
  );
}
