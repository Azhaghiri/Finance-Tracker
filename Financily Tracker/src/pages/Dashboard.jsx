// Dashboard.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddIncome from "../components/AddIncome";
import AddExpense from "../components/AddExpense";
import TransactionTable from "../components/TransactionTable";
import Charts from "../components/Charts";
import notransaction from "../assets/no-transaction.png";
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  // totals
  const [income, setIncome] = useState(0);
  const [expense, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // open handlers (passed to Cards)
  const showExpenseModalVisible = () => setIsExpenseModalVisible(true);
  const showIncomeModalVisible = () => setIsIncomeModalVisible(true);

  // close handlers (used by Modal onCancel / onOk)
  const handleCloseExpenseModal = () => setIsExpenseModalVisible(false);
  const handleCloseIncomeModal = () => setIsIncomeModalVisible(false);

  // called by AddIncome / AddExpense
  const onFinish = (values, type) => {
    // values.date expected to be a moment/dayjs object as before
    const newTransaction = {
      type: type,
      date: values.date ? values.date.format("YYYY-MM-DD") : "",
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
    // close modal after submission
    if (type === "income") handleCloseIncomeModal();
    if (type === "expense") handleCloseExpenseModal();
  };

  // Adds transaction to Firestore and local state (immutable update)
  async function addTransaction(transaction) {
    if (!user) {
      toast.error("You must be logged in to add a transaction");
      return;
    }

    try {
      setLoading(true);
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID:", docRef.id);
      toast.success("Transaction Added!");

      // immutable update and include id
      setTransactions((prev) => [...prev, { ...transaction, id: docRef.id }]);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Couldn't add transaction");
    } finally {
      setLoading(false);
    }
  }

  // Fetch transactions for current user
  async function fetchTransaction() {
    if (!user) return;

    setLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((docSnap) => {
        transactionArray.push({ id: docSnap.id, ...docSnap.data() });
      });

      // ensure amounts are numbers
      const normalized = transactionArray.map((t) => ({
        ...t,
        amount: typeof t.amount === "string" ? parseFloat(t.amount) || 0 : t.amount || 0,
      }));

      setTransactions(normalized);
      console.log("Transactions", normalized);
      // optional: toast.success("Transactions fetched");
    } catch (e) {
      console.error("Error fetching transactions:", e);
      toast.error("Couldn't fetch transactions");
    } finally {
      setLoading(false);
    }
  }

  // Recalculate totals whenever transactions change
  useEffect(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === "income") incomeTotal += amount;
      else expenseTotal += amount;
    });

    setIncome(incomeTotal);
    setExpenses(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }, [transactions]);

  // Fetch when user becomes available
  useEffect(() => {
    if (user) {
      fetchTransaction();
    } else {
      setTransactions([]); // clear on logout
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  let sortedTransaction = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <Header />

      {loading ? (
        <p style={{ padding: 24 }}>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModalVisible={showExpenseModalVisible}
            showIncomeModalVisible={showIncomeModalVisible}
          />

          {/* Show chart when there ARE transactions, otherwise show empty image */}
          {transactions &&    transactions.length !== 0 ? (
           <Charts transactions={transactions} />
          ) : (
            <div style={{ padding: 24 }}>
              <img
                src={notransaction}
                alt="No transactions"
                style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }}
              />
              <p style={{textAlign:'center',marginTop:'10px'}}>No Transcation Here</p>
            </div>
          )}

          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleCloseIncomeModal}
            onFinish={onFinish}
          />

          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleCloseExpenseModal}
            onFinish={onFinish}
          />

          <div style={{ padding: 24 }}>
            <TransactionTable transactions={transactions} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
