"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  TableColumn,
  ModalContent,
} from "@nextui-org/react";

// Define the subscription plan interface
interface SubscriptionPlan {
  id: number;
  name: string;
  callLimit: number;
  regularPrices: number;
  discount: number;
  currentPrice: number;
  durationInMonths: number;
  tag?: string;
  isFree: boolean;
}

// Define the form data interface for updating a subscription plan
interface SubscriptionPlanFormData {
  name: string;
  callLimit: string; // Change to string
  regularPrices: string; // Change to string
  discount: string; // Change to string
  currentPrice: string; // Change to string
  durationInMonths: string; // Change to string
  tag?: string;
  isFree: boolean;
}

const SubscriptionPlansPage: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SubscriptionPlanFormData>({
    name: "",
    callLimit: "0", // Initialize as string
    regularPrices: "0", // Initialize as string
    discount: "0", // Initialize as string
    currentPrice: "0", // Initialize as string
    durationInMonths: "0", // Initialize as string
    tag: "",
    isFree: false,
  });

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const { data } = await axios.get<SubscriptionPlan[]>(
        `${process.env.NEXT_PUBLIC_URL}/subscription-plan`
      );
      console.log(data);
      setSubscriptionPlans(data);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    }
  };

  const openModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      callLimit: plan.callLimit?.toString() || "0", // Check for null and default to "0"
      regularPrices: plan.regularPrices?.toString() || "0", // Check for null and default to "0"
      discount: plan.discount?.toString() || "0", // Check for null and default to "0"
      currentPrice: plan.currentPrice?.toString() || "0", // Check for null and default to "0"
      durationInMonths: plan.durationInMonths?.toString() || "0", // Check for null and default to "0"
      tag: plan.tag || "", // Default to an empty string if null
      isFree: plan.isFree,
    });
    setIsOpen(true);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedPlan) return;

    // Ensure no field is missing
    const updatedFormData = {
      ...formData,
      callLimit: parseInt(formData.callLimit, 10),
      regularPrices: parseInt(formData.regularPrices, 10),
      discount: parseInt(formData.discount, 10),
      currentPrice: parseInt(formData.currentPrice, 10),
      durationInMonths: parseInt(formData.durationInMonths, 10),
      tag: formData.tag || undefined, // Ensure empty strings are sent as undefined
    };

    console.log("Updated FormData being sent to API:", updatedFormData);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/subscription-plan/${selectedPlan.id}`,
        updatedFormData
      );
      setIsOpen(false); // Close the modal after update
      fetchSubscriptionPlans(); // Refresh the data after update
    } catch (error) {
      console.error("Error updating subscription plan:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1>Subscription Plans</h1>

      <Table aria-label="User table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Call Limit</TableColumn>
          <TableColumn>Regular Price</TableColumn>
          <TableColumn>Discount</TableColumn>
          <TableColumn>Current Price</TableColumn>
          <TableColumn>Duration (Months)</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {subscriptionPlans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.name}</TableCell>
              <TableCell>{plan.callLimit}</TableCell>
              <TableCell>{plan.regularPrices}</TableCell>
              <TableCell>{plan.discount}</TableCell>
              <TableCell>{plan.currentPrice}</TableCell>
              <TableCell>{plan.durationInMonths}</TableCell>
              <TableCell>
                <Button onPress={() => openModal(plan)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* {isModalOpen && ( */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>Edit Subscription Plan</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <Input
              label="Call Limit"
              name="callLimit"
              value={formData.callLimit}
              onChange={handleFormChange}
            />
            <Input
              label="Regular Price"
              name="regularPrices"
              value={formData.regularPrices}
              onChange={handleFormChange}
            />
            <Input
              label="Discount"
              name="discount"
              value={formData.discount}
              onChange={handleFormChange}
            />
            <Input
              label="Current Price"
              name="currentPrice"
              value={formData.currentPrice}
              onChange={handleFormChange}
            />
            <Input
              label="Duration (Months)"
              name="durationInMonths"
              value={formData.durationInMonths}
              onChange={handleFormChange}
            />
            <Input
              label="Tag"
              name="tag"
              value={formData.tag}
              onChange={handleFormChange}
            />
            <label>
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleFormChange}
              />
              Is Free
            </label>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleUpdate}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SubscriptionPlansPage;
