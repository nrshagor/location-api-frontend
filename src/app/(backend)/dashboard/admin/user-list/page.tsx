"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Button,
} from "@nextui-org/react";

interface user {
  id: number;
  firstName: string;
  lastname: string;
  email: string;
  companyName: string;
  profilePictureUrl: string;
}

interface userResponse {
  data: user[];
  total: number;
}

const Page = () => {
  const [users, setUsers] = useState<user[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState({
    firstName: "",
    userId: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();

      // Append filters to query params
      if (filters.firstName) query.append("firstName", filters.firstName);
      if (filters.userId) query.append("userId", filters.userId);
      if (filters.email) query.append("email", filters.email);

      // Pagination params
      query.append("page", page.toString());
      query.append("limit", limit.toString());

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/auth/user-info?${query.toString()}`
      );

      setUsers(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1>User Table</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="First Name"
          name="firstName"
          value={filters.firstName}
          onChange={handleFilterChange}
        />
        <Input
          placeholder="User ID"
          name="userId"
          value={filters.userId}
          onChange={handleFilterChange}
        />
        <Input
          placeholder="Email"
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <Button onPress={fetchUsers}>Filter</Button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          aria-label="User table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                page={page}
                total={Math.ceil(total / limit)}
                onChange={setPage}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>First Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Company Name</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>
                  <Button onPress={() => console.log("Action for", user.id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination Controls */}
      <div className="flex gap-4 mb-4">
        <label htmlFor="limit">Rows per page:</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default Page;
