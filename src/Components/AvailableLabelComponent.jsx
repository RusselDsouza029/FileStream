import { useEffect, useState } from "react";
import { AppUseContext } from "../context/AppContext";

const AvailableLabelComponent = ({ fileName }) => {
  const { userEmail, supabase, userId } = AppUseContext();
  const [aboutFileLabel, setAboutFileLabel] = useState([]);
  async function checkFileLabeled(fileName) {
    const { data, error } = await supabase
      .from("labelsdetails")
      .select("*")
      .eq("email", userEmail)
      .eq("fileName", fileName);

    if (error) {
      console.log(error);
    } else {
      setAboutFileLabel(data);
    }
  }
  useEffect(() => {
    checkFileLabeled(fileName);
    // eslint-disable-next-line
  }, [userId]);
  const uniqueLabels = new Set();
  return (
    <div>
      {aboutFileLabel[0] ? (
        <>
          <p style={{ marginBottom: 5 }}>
            <span>Label</span>
            <br />
          </p>
          <div className="available-label-container">
            {aboutFileLabel.map((data, ind) => {
              const labelName = data.labelname;
              if (!uniqueLabels.has(labelName)) {
                uniqueLabels.add(labelName);
                return (
                  <p key={ind} className="label-box">
                    {labelName}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AvailableLabelComponent;
