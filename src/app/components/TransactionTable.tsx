import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import CustomModal from "./CustomModal"; // Import the modal component

interface Transaction {
  id: number;
  accountNumber: string;
  transactionId: string;
  transactionType: string;
  amount: number;
  isVerify: boolean;
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
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [transactionToVerify, setTransactionToVerify] =
    useState<Transaction | null>(null);
  const [transactionIdInput, setTransactionIdInput] = useState<string>(""); // State to store input value
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<TransactionResponse>(
        "http://localhost:4000/transaction",
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

  const handleLimitChange = (newLimit: string) => {
    const numericLimit = parseInt(newLimit, 10);
    if (!isNaN(numericLimit)) {
      setLimit(numericLimit);
    }
  };

  const openModal = (transaction: Transaction) => {
    setTransactionToVerify(transaction); // Set the correct transaction
    // Pre-fill the input field with the transaction ID
    setSuccessMessage(""); // Clear previous success messages
    setModalOpen(true);
  };

  const handleVerifySubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/transaction/verify",
        {
          transactionId: transactionIdInput, // Use the input value from the modal
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Transaction verified successfully");
        fetchTransactions(); // Refresh transactions after verification
        setTimeout(() => {
          closeModal(); // Close modal after success with a delay
        }, 1500);
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setSuccessMessage("Invalid transaction ID or verification failed");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTransactionToVerify(null); // Clear the selected transaction
    setTransactionIdInput(""); // Clear the input value
    setSuccessMessage(""); // Clear success message
  };

  return (
    <div>
      <h1>Transaction Table</h1>

      {/* Filters */}
      <div>
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={filters.accountNumber}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="transactionId"
          placeholder="Transaction ID"
          value={filters.transactionId}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="transactionType"
          placeholder="Transaction Type"
          value={filters.transactionType}
          onChange={handleFilterChange}
        />
        <button onClick={fetchTransactions}>Filter</button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border={1} cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Account Number</th>
              <th>Transaction ID</th>
              <th>Transaction Type</th>
              <th>Amount</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.accountNumber}</td>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.isVerify ? "Yes" : "No"}</td>
                  <td>
                    {!transaction.isVerify ? (
                      <button onClick={() => openModal(transaction)}>
                        Verify
                      </button>
                    ) : (
                      "Verified"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}>
          Previous
        </button>
        <span>{` Page ${page} of ${Math.ceil(total / limit)} `}</span>
        <button
          onClick={() =>
            setPage((prev) => (prev * limit < total ? prev + 1 : prev))
          }
          disabled={page * limit >= total}>
          Next
        </button>

        {/* Limit selection */}
        <div>
          <label>Items per page: </label>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(e.target.value)}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Modal for Verification */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Verify Transaction</h2>
        <input
          type="text"
          value={transactionIdInput} // Editable input field
          onChange={(e) => setTransactionIdInput(e.target.value)} // Update the input value
          placeholder="Enter Transaction ID"
        />
        <button onClick={handleVerifySubmit}>Submit</button>
        {successMessage && <p>{successMessage}</p>}
      </CustomModal>
    </div>
  );
};

export default TransactionTable;
