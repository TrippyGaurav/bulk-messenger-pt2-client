"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { createUsers } from "../lib/api";
export const page = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState({
    username: "",
    name: "",
    password: "",
    role: selectedRole,
    keys: "",
  });

  const handleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  function handleAgentMessage(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setMessage((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSend(e) {
    console.log(message);
    e.preventDefault();
    createUsers(message);
    setMessage({ username: "", name: "", password: "", role: "", keys: "" });
  }
  return (
    <motion.div
      className="m-auto mt-[10%] w-[35%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form className="flex flex-col gap-[5px]" onSubmit={handleSend}>
        <label className="text-lg font-semibold mt-2" htmlFor="name">
          Name
        </label>
        <input
          className="border-2 border-[#8C8C8C] rounded-md p-2 resize-none"
          name="name"
          placeholder="Enter Name"
          required
          value={message.name}
          onChange={handleAgentMessage}
        ></input>
        <label className="text-lg font-semibold mt-2" htmlFor="username">
          Username
        </label>
        <input
          className="border-2 border-[#8C8C8C] rounded-md p-2 resize-none"
          name="username"
          placeholder="e.g, Rahul"
          required
          value={message.username}
          onChange={handleAgentMessage}
        ></input>
        <label className="text-lg font-semibold mt-2" htmlFor="password">
          Password
        </label>
        <input
          className="border-2 border-[#8C8C8C] rounded-md p-2"
          name="password"
          placeholder="*********"
          type="Password"
          required
          value={message.password}
          onChange={handleAgentMessage}
        />
        {selectedRole === "admin" && (
          <input
            className="border-2 border-[#8C8C8C] rounded-md p-2 mt-4"
            name="keys"
            placeholder="API key"
            required
            value={message.keys}
            onChange={handleAgentMessage}
          />
        )}
        <select
          className="text-sm mt-6 w-fit border-[#8C8C8C] border-[1px] p-1 rounded-2xl"
          onChange={handleChange}
          name="role"
          value={message.role}
        >
          <option hidden value="role">
            Role
          </option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>

        <div className="flex justify-between items-end mt-6">
          <button className="bg-[#252727] px-4 py-3 w-full rounded-md font-semibold text-white hover:bg-[#1877F2]  transition-all duration-300 ease">
            CREATE
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default page;
