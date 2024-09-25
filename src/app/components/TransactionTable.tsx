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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface Transaction {
  id: number;
  accountNumber: string;
  transactionId: string;
  transactionType: string;
  amount: number;
  isVerify: boolean;
  ipOrDomain: string;
}

interface TransactionResponse {
  data: Transaction[];
  total: number;
}

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState({
    accountNumber: "",
    transactionId: "",
    transactionType: "",
    ipOrDomain: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [transactionToVerify, setTransactionToVerify] =
    useState<Transaction | null>(null);
  const [transactionIdInput, setTransactionIdInput] = useState<string>("");
  const [ipOrDomainInput, setipOrDomainInput] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<TransactionResponse>(
        `${process.env.NEXT_PUBLIC_URL}/transaction`,
        {
          params: {
            page,
            limit,
            ...filters,
          },
        }
      );
      setTransactions(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
  };

  const openModal = (transaction: Transaction) => {
    setTransactionToVerify(transaction);
    setTransactionIdInput(transaction.transactionId); // Set transaction ID input
    setipOrDomainInput(transaction.ipOrDomain); // Set ipOrDomain input
    setSuccessMessage("");
    setIsOpen(true);
  };

  const handleVerifySubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/transaction/verify`,
        {
          transactionId: transactionIdInput,
          ipOrDomain: ipOrDomainInput,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Transaction verified successfully");
        fetchTransactions();
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setSuccessMessage("Invalid transaction ID or verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1>Transaction Table</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Account Number"
          name="accountNumber"
          value={filters.accountNumber}
          onChange={handleFilterChange}
        />
        <Input
          placeholder="Transaction ID"
          name="transactionId"
          value={filters.transactionId}
          onChange={handleFilterChange}
        />
        <Input
          placeholder="Transaction Type"
          name="transactionType"
          value={filters.transactionType}
          onChange={handleFilterChange}
        />
        <Button onPress={fetchTransactions}>Filter</Button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          aria-label="Transaction table"
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
          }>
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Account Number</TableColumn>
            <TableColumn>Transaction ID</TableColumn>
            <TableColumn>Ip Or Domain</TableColumn>
            <TableColumn>Transaction Type</TableColumn>
            <TableColumn>Amount</TableColumn>
            <TableColumn>Verified</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.accountNumber}</TableCell>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{transaction.ipOrDomain}</TableCell>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.isVerify ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {transaction.isVerify ? (
                    <Button isDisabled color="primary" variant="flat">
                      Verified
                    </Button>
                  ) : (
                    <Button onPress={() => openModal(transaction)}>
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex gap-4 mb-4">
        <label htmlFor="limit">Rows per page:</label>
        <select id="limit" value={limit} onChange={handleLimitChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Modal for Verification */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Verify Transaction</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter Transaction ID"
              value={transactionIdInput}
              onChange={(e) => setTransactionIdInput(e.target.value)}
            />
            <Input
              readOnly
              placeholder="IP or Domain"
              value={ipOrDomainInput} // Show the IP or Domain in the input
              onChange={(e) => setipOrDomainInput(e.target.value)}
            />

            {successMessage && (
              <Button
                color={
                  successMessage === "Transaction verified successfully"
                    ? "success"
                    : "danger"
                }
                variant="flat">
                <p>{successMessage}</p>
              </Button>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpen(false)}>
              Close
            </Button>
            <Button
              color="primary"
              isLoading={isSubmitting}
              onPress={handleVerifySubmit}>
              {isSubmitting ? "Loading..." : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TransactionTable;
