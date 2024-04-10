import {
  deleteAgentByUsername,
  updateAgentByUsername,
} from "@/app/lib/new-api";
import action from "@/app/lib/server/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Edit = ({ user, onClose }) => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: user.name,
    username: user.username,
    password: "",
    passwordConfirm: "",
    status: user.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and passwordConfirm are the same
    if (formState.password !== formState.passwordConfirm) {
      console.error("Passwords do not match.");
      // Handle the error, e.g., show an error message
      return;
    }

    const updatedFields = {};

    Object.keys(formState).forEach((key) => {
      if (formState[key] !== user[key]) {
        updatedFields[key] = formState[key];
      }
    });

    // Remove passwordConfirm from the fields to be sent
    delete updatedFields.passwordConfirm;
    console.log(updatedFields, "updated");

    const response = await updateAgentByUsername(user.username, updatedFields);
    console.log("RESP : ", response);

    if (response.success) {
      toast.success(response.message);
      await action();
      // onClose();
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteUser = (username) => {
    console.log("DDLETE : ", username);
    deleteAgentByUsername(username)
      .then((res) => {
        console.log(res);
        if (res.success) {
          toast.success(res.message);
          onClose();
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        console.log("Failed to Delete : ", username);
      });
  };

  return (
    <div class="grid place-items-center">
      <div class="w-full px-6 bg-white ">
        <form class="mt-6" onSubmit={handleSubmit}>
          <div class="flex justify-between gap-3">
            <span class="w-1/2">
              <label
                for="firstname"
                class="block text-xs font-semibold text-gray-600 uppercase"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John"
                autoComplete="given-name"
                class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                value={formState.name}
                onChange={handleChange}
              />
            </span>
            <span class="w-1/2">
              <label
                for="lastname"
                class="block text-xs font-semibold text-gray-600 uppercase"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Doe"
                autoComplete="family-name"
                class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
                value={formState.username}
                onChange={handleChange}
              />
            </span>
          </div>

          <label
            for="password"
            class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            autoComplete="new-password"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            value={formState.password}
            onChange={handleChange}
          />
          <label
            for="password-confirm"
            class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
          >
            Confirm password
          </label>
          <input
            id="passwordConfirm"
            type="password"
            name="passwordConfirm"
            placeholder="********"
            autoComplete="new-password"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            value={formState.passwordConfirm}
            onChange={handleChange}
          />

          <label
            for="status"
            class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            value={formState.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            class="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => handleDeleteUser(user?.username)}
            className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-red-500 shadow-lg focus:outline-none hover:bg-red-700 hover:shadow-none"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
