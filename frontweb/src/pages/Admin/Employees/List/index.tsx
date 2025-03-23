import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { hasAnyRoles } from 'util/auth';
import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';


const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const [activePage, setActivePage] = useState<number>(0);

  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/employees",
      params: {
        page: activePage,
        size: 4,
      },
      withCredentials: true,
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [activePage]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  return (
    <>
      {hasAnyRoles(["ROLE_ADMIN"]) && (
        <Link to="/admin/employees/create">
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
      </Link>
      )
      }
      <div>
        {page?.content.map((employee) => (
          <div key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        ))}
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={4}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
