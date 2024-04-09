"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { formatDate, sortData, trimMessage } from "@/app/lib/client/utils";
import { getAgentAllMessages, updateAgentStatus } from "@/app/lib/new-api";
import Edit from "./Edit";
import toast from "react-hot-toast";
import ViewMessage from "./ViewMessage";

const MODAL_CONTENT_TYPES = {
  MESSAGES: "messages",
  EDIT_AGENT: "editAgent",
  VIEW_MESSAGE: "viewMessage",
};

const Table = ({ type, data, fieldsHeadings, fieldsData }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState(tableData);
  const currentDate = new Date().toISOString().split("T")[0];
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [agentMessages, setAgentMessages] = useState([]);
  const [fliteredCount, setFilteredCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState({});

  const [agentFieldsHeadings, setAgentFieldsHeadings] = useState([
    "Message",
    "Sent To",
    "Status",
    "Created At",
  ]);
  const [agentFieldsData, setAgentFieldsData] = useState([
    "message",
    "sent_to",
    "status",
    "created_at",
  ]);
  const [createdAtSortOrder, setCreatedAtSortOrder] = useState("asc");

  useEffect(() => {
    setTableData(data);
    setFilteredData(data);
  }, []);

  useEffect(() => {
    const newData = filterDataBySearch(data);
    setFilteredData(newData);
  }, [searchInput]);

  useEffect(() => {
    setFilteredCount(filteredData.length);
  }, [filteredData]);

  const handleDateChange = (e) => {
    const date = e.target.value;

    const filteredData = date
      ? data.filter(
          (item) =>
            new Date(item.created_at).toDateString() ===
            new Date(date).toDateString()
        )
      : data;
    console.log(filteredData);

    setFilteredData(filteredData);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setModalContent(MODAL_CONTENT_TYPES.EDIT_AGENT);
    setIsModalOpen(true);
  };

  const handleOpenMessagesModal = (user) => {
    getAgentAllMessages(user?.username)
      .then((messages) => {
        setAgentMessages(messages);
        setSelectedUser(user);

        if (messages.length <= 0) {
          toast.success(`Data not available : ${selectedUser.name}`);
        } else {
          setModalContent(MODAL_CONTENT_TYPES.MESSAGES);
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.log("Failed to fetch messages : ", error);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filterDataBySearch = (data) => {
    if (!searchInput) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  };

  const statusChangeHandler = (e) => {
    const selectedStatus = e.target.value;

    const data =
      selectedStatus === "all"
        ? tableData
        : tableData.filter((item) => item.status === selectedStatus);

    setFilteredData(data);
  };

  const handleViewData = (data) => {
    if (type === "agentMessage") {
      setSelectedMessage(data);
      setModalContent(MODAL_CONTENT_TYPES.VIEW_MESSAGE);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        className={`mx-auto w-full  flex flex-col gap-6 mb-6 p-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-3 px-4 py-2 rounded-3xl bg-[whitesmoke] w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className=" w-full bg-transparent"
              placeholder="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className=" flex items-center gap-8">
            <div>
              <span>Total : {fliteredCount}</span>
            </div>
            <input
              type="date"
              name="date"
              onChange={handleDateChange}
              // defaultValue={currentDate}
              max={currentDate}
              className="border-[#8C8C8C] border p-1 rounded-lg"
            />
          </div>
        </div>
        <table className=" w-ful">
          <thead>
            <tr className=" border-b border-black">
              {fieldsHeadings.map((heading, index) => {
                switch (heading) {
                  case "Status":
                    return (
                      <td
                        className={`text-base font-bold m-0 text-[#252727] text-center py-4 px-2`}
                      >
                        <select
                          defaultValue="Status"
                          onChange={statusChangeHandler}
                          className=" bg-transparent text-center"
                        >
                          <option hidden value="Status">
                            {heading}
                          </option>
                          <option value="all">All</option>
                          {type === "agentTable" && (
                            <>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </>
                          )}
                          {type === "agentMessage" && (
                            <>
                              <option value="success">Success</option>
                              <option value="failed">Failed</option>
                              <option value="pending">Pending</option>
                            </>
                          )}
                        </select>
                      </td>
                    );

                  case "Created At":
                    return (
                      <td
                        className={`text-base font-bold m-0 text-[#252727] text-center py-4 px-2 cursor-pointer`}
                        onClick={() =>
                          sortData(
                            "created_at",
                            tableData,
                            filteredData,
                            setFilteredData,
                            createdAtSortOrder,
                            setCreatedAtSortOrder
                          )
                        }
                      >
                        <div className=" flex items-center justify-center gap-2">
                          {heading}

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${createdAtSortOrder}`}
                            style={{
                              transform:
                                createdAtSortOrder === "asc"
                                  ? "rotate(0deg)"
                                  : "rotate(180deg)",
                              transition: "transform 0.3s ease-in-out",
                            }}
                          >
                            <path d="m3 16 4 4 4-4" />
                            <path d="M7 20V4" />
                            <path d="m21 8-4-4-4 4" />
                            <path d="M17 4v16" />
                          </svg>
                        </div>
                      </td>
                    );
                  default:
                    return (
                      <td
                        className={`text-base font-bold m-0 text-[#252727] text-center py-4 px-2`}
                      >
                        {heading}
                      </td>
                    );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, idx) => {
              const { formattedDate, formattedTime } = formatDate(
                data.created_at
              );
              return (
                <tr
                  key={idx}
                  className=" hover:bg-[whitesmoke] cursor-pointer"
                  onClick={() => handleViewData(data)}
                >
                  {fieldsData.map((field) => {
                    switch (field) {
                      case "created_at":
                        return (
                          <td className="p-2  text-center text-base">
                            <p>{formattedTime}</p>
                            <p className=" text-sm">{formattedDate}</p>
                          </td>
                        );
                      case "message":
                        return (
                          <td className={`p-2 text-center text-base`}>
                            {trimMessage(data[field])}
                          </td>
                        );
                      case "status":
                        return (
                          <td className={`p-2  text-center text-base`}>
                            <div
                              className={`${field}-${data[field]} py-2 px-4 text-center rounded-3xl text-base`}
                            >
                              {data[field]}
                            </div>
                          </td>
                        );

                      case "messages":
                        return (
                          <td
                            className={`p-2  text-center text-base m-auto`}
                            onClick={() => handleOpenMessagesModal(data)}
                          >
                            <div className=" flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-message-square-text hover:stroke-blue-600"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                <path d="M13 8H7" />
                                <path d="M17 12H7" />
                              </svg>
                            </div>
                          </td>
                        );
                      case "edit":
                        return (
                          <td
                            className={`p-2  text-center text-base`}
                            onClick={() => handleOpenEditModal(data)}
                          >
                            <div className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-ellipsis-vertical"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </div>
                          </td>
                        );

                      default:
                        return (
                          <td className={`p-2 text-center text-base`}>
                            {data[field]}
                          </td>
                        );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent === MODAL_CONTENT_TYPES.MESSAGES && (
            <Table
              type="agentMessage"
              data={agentMessages}
              fieldsHeadings={agentFieldsHeadings}
              fieldsData={agentFieldsData}
            />
          )}
          {modalContent === MODAL_CONTENT_TYPES.EDIT_AGENT && (
            <Edit user={selectedUser} onClose={handleCloseModal} />
          )}

          {modalContent === MODAL_CONTENT_TYPES.VIEW_MESSAGE && (
            <ViewMessage message={selectedMessage} />
          )}
        </Modal>
      </motion.div>
    </>
  );
};
export default Table;
