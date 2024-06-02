import React, { useEffect, useState } from "react";
import { AppUseContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Main.scss";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineLabelOff } from "react-icons/md";

const LabelComponent = () => {
  const { userId, supabase, userEmail, userStatus } = AppUseContext();
  const navigate = useNavigate();

  const [fetchedUserLabel, setFetchedUserLabel] = useState([]);

  async function fetchLabels() {
    const { data, error } = await supabase
      .from("labelsdetails")
      .select("*")
      .eq("email", userEmail);
    if (error) {
      console.error("Error fetching labels:", error);
    } else {
      setFetchedUserLabel(data);
    }
  }

  useEffect(() => {
    fetchLabels();
    // eslint-disable-next-line
  }, [userId]);
  const uniqueLabels = new Set();

  async function handleDeleteLabel({ label }) {
    const { error } = await supabase
      .from("labelsdetails")
      .delete()
      .eq("email", userEmail)
      .eq("labelname", label);

    if (error) {
      console.error("Error while deleting label", error);
    } else {
      fetchLabels();
    }
  }

  useEffect(() => {
    if (!userStatus) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [userStatus]);
  return (
    <>
      {/* <button onClick={fetchLabels}>get data</button> */}
      {fetchedUserLabel[0] ? (
        <div className="label-component">
          {fetchedUserLabel.map((data, index) => {
            const labelName = data.labelname;
            if (!uniqueLabels.has(labelName)) {
              // Check if labelName is already in the Set
              uniqueLabels.add(labelName);
              return (
                <div key={labelName} className="label-box-container">
                  <Link to={`/label/${labelName}`}>{labelName}</Link>
                  <button
                    onClick={() => {
                      handleDeleteLabel({ label: labelName });
                    }}
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="label-not-found">
          <MdOutlineLabelOff />
          <p>Label not found</p>
        </div>
      )}
    </>
  );
};

export default LabelComponent;
