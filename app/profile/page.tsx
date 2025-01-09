/** @format */

"use client";

import { useEffect, useState } from "react";
import BarChart from "@/components/BarChart";
import { useRouter } from "next/navigation";
import React from "react";
import LineChart from "@/components/LineChart";
import PolarAreaChart from "@/components/PieChart";

const eventIdToCohort: Record<number, string> = {
  20: "Cohort 1",
  72: "Cohort 2",
  250: "Cohort 3",
};

const processEventUserData = (eventUserData: EventUser[]) => {
  const levelData: {
    [level: number]: { total: number; events: { [eventId: number]: number } };
  } = {};

  eventUserData.forEach(({ level, eventId }) => {
    if (!levelData[level]) {
      levelData[level] = { total: 0, events: {} };
    }
    levelData[level].total += 1;
    levelData[level].events[eventId] =
      (levelData[level].events[eventId] || 0) + 1;
  });

  const levels = Object.keys(levelData)
    .map(Number)
    .sort((a, b) => a - b);
  const totals = levels.map((level) => levelData[level].total);
  const tooltips = levels.map((level) =>
    Object.entries(levelData[level].events)
      .map(
        ([eventId, count]) =>
          `${eventIdToCohort[Number(eventId)] || `Event ${eventId}`}: ${count}`
      )
      .join("<br>")
  );

  return { levels, totals, tooltips };
};

const API_DOMAIN = "learn.reboot01.com";
const GRAPHQL_ENDPOINT = `https://${API_DOMAIN}/api/graphql-engine/v1/graphql`;

// Define TypeScript interfaces

interface User {
  auditRatio: number;
  email: string;
  firstName: string;
  lastName: string;
  login: string;
  totalDown: number;
  totalUp: number;
  groupsByCaptainid: Group[];
}

interface Group {
  campus: string;
  captainId: string;
  captainLogin: string;
  createdAt: string;
  eventId: string;
  id: string;
  objectId: string;
  path: string;
  status: string;
  updatedAt: string;
}

interface GraphQLResponse {
  data: {
    user: User;
    event_user: EventUser[];
    transaction: Transaction[];
  };
}

interface EventUser {
  level: number;
  userId: string;
  userLogin: string;
  eventId: number;
}

interface Transaction {
  amount: number;
  path: string;
  type: string;
  userLogin: string;
  eventId: number;
}

const query = `
  query User {
    user {
        auditRatio
        email
        firstName
        lastName
        login
        totalDown
        totalUp
        groupsByCaptainid {
            campus
            captainId
            captainLogin
            createdAt
            eventId
            id
            objectId
            path
            status
            updatedAt
        }
    }
    event_user(where: { eventId: { _in: [72, 20, 250] } }) {
        level
        userId
        userLogin
        eventId
    }
    transaction {
        amount
        path
        type
        userLogin
        eventId
    }
  }`;

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [eventUserData, setEventUserData] = useState<EventUser[] | []>([]);
  const [transactionData, setTransactionData] = useState<Transaction[] | []>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setError("Please log in first.");
        return;
      }

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const result: GraphQLResponse = await response.json();

        if (
          !result.data ||
          !result.data.user ||
          !Array.isArray(result.data.user) ||
          result.data.user.length === 0 ||
          !Array.isArray(result.data.event_user) ||
          !Array.isArray(result.data.transaction)
        ) {
          throw new Error("User data is missing or invalid");
        }

        setUserData(result.data.user[0]);
        setEventUserData(result.data.event_user);
        setTransactionData(result.data.transaction);

        console.log("My data is ", result.data.user[0]);
        console.log("EventData: ", result.data.event_user);
        console.log("Transaction Data: ", result.data.transaction);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!userData || !eventUserData) return <p>Loading the data...</p>;

  const { levels, totals, tooltips } = processEventUserData(eventUserData);

  return (
    <>
      <header className="bg-primary text-white py-4 px-6 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-lg font-bold">GraphQL</h1>
        <button
          onClick={() => {
            localStorage.removeItem("jwt");
            router.push("/login");
          }}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-heading font-heading text-foreground dark:text-dark-foreground">
            Welcome {userData.firstName} {userData.lastName}!
          </h1>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-5">Profile Information</h1>
          <p className="text-gray-800 mb-3">
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-gray-600">{userData.email}</span>
          </p>
          <p className="text-gray-800 mb-3">
            <span className="font-semibold">Name:</span>{" "}
            <span className="text-gray-600">
              {userData.firstName} {userData.lastName}
            </span>
          </p>
          <p className="text-gray-800 mb-3">
            <span className="font-semibold">Username:</span>{" "}
            <span className="text-gray-600">{userData.login}</span>
          </p>
          <p className="text-gray-800 mb-3">
            <span className="font-semibold">Audit Ratio:</span>{" "}
            <span className="text-gray-600">
              {userData.auditRatio.toFixed(1)}
            </span>
          </p>
          <p className="text-gray-800 mb-3">
            <span className="font-semibold">Audits Done:</span>{" "}
            <span className="text-gray-600">
              {userData.totalUp}
              {" Bytes"}
            </span>
          </p>
          <p className="text-gray-800 mb-3">
            <span className="font-semibold">Audits Received:</span>{" "}
            <span className="text-gray-600">
              {userData.totalDown}
              {" Bytes"}
            </span>
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-5">Audits Ratio</h2>
          {userData && (
            <BarChart
              totalUp={userData.totalUp}
              totalDown={userData.totalDown}
            />
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-5">Best Skills</h2>
          {transactionData && <PolarAreaChart transactions={transactionData} />}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-5">Level Distribution</h2>
          <LineChart levels={levels} totals={totals} tooltips={tooltips} />
        </div>
      </div>
    </>
  );
}
