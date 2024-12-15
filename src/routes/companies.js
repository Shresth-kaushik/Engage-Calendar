import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./companies.css";

function CompanyListPage() {
  const {
    state,
    updateCompany,
    deleteCompany,
    addCompanyCommunicationMethod,
    updateCompanyCommunicationMethod,
    deleteCompanyCommunicationMethod,
  } = useCommunication();

  // Company Edit State
  const [editingCompany, setEditingCompany] = useState(null);

  // Communication Method Edit State
  const [editingMethod, setEditingMethod] = useState(null);

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
    communicationMethods: [],
  });

  // Communication Method Form State
  const [methodForm, setMethodForm] = useState({
    id: "",
    name: "",
    description: "",
    sequence: 0,
    isMandatory: false,
    companyId: null,
  });

  // Company Form Handlers
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...companyForm.emails];
    newEmails[index] = value;
    setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
  };

  const handleAddEmail = () => {
    setCompanyForm((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...companyForm.phoneNumbers];
    newPhones[index] = value;
    setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
  };

  const handleAddPhone = () => {
    setCompanyForm((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""],
    }));
  };

  // Start Editing Company
  const startEditCompany = (company) => {
    setEditingCompany(company.id);
    setCompanyForm({ ...company });
  };

  // Update Company
  const handleUpdateCompany = (e) => {
    e.preventDefault();
    updateCompany(companyForm);
    setEditingCompany(null);
  };

  // Communication Method Handlers
  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Start Editing Method
  const startEditMethod = (method, companyId) => {
    setEditingMethod({ methodId: method.id, companyId });
    setMethodForm({
      ...method,
      companyId: companyId,
    });
  };

  // Update Communication Method
  const handleUpdateMethod = (e) => {
    e.preventDefault();
    updateCompanyCommunicationMethod(methodForm);
    setEditingMethod(null);
  };

  // Add New Method to Company
  const handleAddMethod = (companyId) => {
    const newMethod = {
      ...methodForm,
      companyId,
      id: "", // Reset ID to create new method
      sequence:
        state.companies.find((c) => c.id === companyId).communicationMethods
          .length + 1,
    };
    addCompanyCommunicationMethod(newMethod);
    // Reset method form
    setMethodForm({
      id: "",
      name: "",
      description: "",
      sequence: 0,
      isMandatory: false,
      companyId: null,
    });
  };

  const renderContactDetails = (company) => {
    return (
      <div className="contact-details">
        {/* Emails Section */}
        <div className="contact-section">
          <h4>Emails</h4>
          {company.emails && company.emails.length > 0 ? (
            <ul>
              {company.emails.map((email, index) => (
                <li key={index}>
                  <span className="email-icon">✉️</span> {email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No email addresses</p>
          )}
        </div>

        {/* Phone Numbers Section */}
        <div className="contact-section">
          <h4>Phone Numbers</h4>
          {company.phoneNumbers && company.phoneNumbers.length > 0 ? (
            <ul>
              {company.phoneNumbers.map((phone, index) => (
                <li key={index}>
                  <span className="phone-icon">📞</span> {phone}
                </li>
              ))}
            </ul>
          ) : (
            <p>No phone numbers</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="company-list-page">
      <h1>Companies Management</h1>

      {state.companies.map((company) => (
        <div key={company.id} className="company-card">
          {editingCompany === company.id ? (
            <form onSubmit={handleUpdateCompany} className="edit-company-form">
              <input
                type="text"
                name="name"
                value={companyForm.name}
                onChange={handleCompanyChange}
                placeholder="Company Name"
                required
              />
              <input
                type="text"
                name="location"
                value={companyForm.location}
                onChange={handleCompanyChange}
                placeholder="Location"
              />
              <input
                type="url"
                name="linkedinProfile"
                value={companyForm.linkedinProfile}
                onChange={handleCompanyChange}
                placeholder="LinkedIn Profile"
              />

              {/* Email Management */}
              <div className="email-management">
                <h4>Emails</h4>
                {companyForm.emails.map((email, index) => (
                  <input
                    key={index}
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Email Address"
                  />
                ))}
                <button type="button" onClick={handleAddEmail}>
                  Add Email
                </button>
              </div>

              {/* Phone Number Management */}
              <div className="phone-management">
                <h4>Phone Numbers</h4>
                {companyForm.phoneNumbers.map((phone, index) => (
                  <input
                    key={index}
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder="Phone Number"
                  />
                ))}
                <button type="button" onClick={handleAddPhone}>
                  Add Phone
                </button>
              </div>

              <input
                type="number"
                name="communicationPeriodicity"
                value={companyForm.communicationPeriodicity}
                onChange={handleCompanyChange}
                placeholder="Communication Frequency (days)"
              />
              <textarea
                name="comments"
                value={companyForm.comments}
                onChange={handleCompanyChange}
                placeholder="Additional Comments"
              />

              <div className="form-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingCompany(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="company-details">
              <h2>{company.name}</h2>
              <p>Location: {company.location}</p>
              <p>LinkedIn: {company.linkedinProfile || "N/A"}</p>
              <p>
                Communication Frequency: {company.communicationPeriodicity} days
              </p>

              {renderContactDetails(company)}

              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>
                  Edit Company
                </button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete Company
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompanyListPage;

// import React, { useState } from "react";
// import { useCommunication } from "../context/data";
// import "./companies.css";

// function CompanyListPage() {
//   const {
//     state,
//     addCompany,
//     updateCompany,
//     deleteCompany,
//     addCompanyCommunicationMethod,
//     updateCompanyCommunicationMethod,
//     deleteCompanyCommunicationMethod,
//   } = useCommunication();

//   // Company Management State
//   const [companyForm, setCompanyForm] = useState({
//     id: "",
//     name: "",
//     location: "",
//     linkedinProfile: "",
//     emails: [""],
//     phoneNumbers: [""],
//     comments: "",
//     communicationPeriodicity: 14,
//     communicationMethods: [],
//   });

//   // Communication Method Management State
//   const [methodForm, setMethodForm] = useState({
//     id: "",
//     name: "",
//     description: "",
//     sequence: 0,
//     isMandatory: false,
//     companyId: null,
//   });

//   // Edit Mode States
//   const [editingCompany, setEditingCompany] = useState(null);
//   const [editingMethod, setEditingMethod] = useState(null);
//   const [selectedCompanyForMethod, setSelectedCompanyForMethod] =
//     useState(null);

//   // Company Form Handlers
//   const handleCompanyChange = (e) => {
//     const { name, value } = e.target;
//     setCompanyForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEmailChange = (index, value) => {
//     const newEmails = [...companyForm.emails];
//     newEmails[index] = value;
//     setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
//   };

//   const handleAddEmail = () => {
//     setCompanyForm((prev) => ({
//       ...prev,
//       emails: [...prev.emails, ""],
//     }));
//   };

//   const handlePhoneChange = (index, value) => {
//     const newPhones = [...companyForm.phoneNumbers];
//     newPhones[index] = value;
//     setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
//   };

//   const handleAddPhone = () => {
//     setCompanyForm((prev) => ({
//       ...prev,
//       phoneNumbers: [...prev.phoneNumbers, ""],
//     }));
//   };

//   const startEditCompany = (company) => {
//     setCompanyForm(company);
//     setEditingCompany(company.id);
//   };

//   const handleAddCompany = (e) => {
//     e.preventDefault();
//     const companyPayload = {
//       ...companyForm,
//       communicationMethods:
//         companyForm.communicationMethods.length > 0
//           ? companyForm.communicationMethods
//           : state.globalCommunicationMethods.map((method) => ({
//               ...method,
//               companyId: null,
//             })),
//     };

//     if (editingCompany) {
//       updateCompany(companyPayload);
//       setEditingCompany(null);
//     } else {
//       addCompany(companyPayload);
//     }

//     // Reset form
//     setCompanyForm({
//       id: "",
//       name: "",
//       location: "",
//       linkedinProfile: "",
//       emails: [""],
//       phoneNumbers: [""],
//       comments: "",
//       communicationPeriodicity: 14,
//       communicationMethods: [],
//     });
//   };

//   // Communication Method Form Handlers
//   const handleMethodChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setMethodForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddCommunicationMethod = (e) => {
//     e.preventDefault();

//     // Validate inputs
//     if (!methodForm.name) {
//       alert("Method name is required");
//       return;
//     }

//     const methodPayload = {
//       ...methodForm,
//       companyId: selectedCompanyForMethod,
//       sequence:
//         methodForm.sequence ||
//         (selectedCompanyForMethod
//           ? editingMethod
//             ? methodForm.sequence
//             : companyForm.communicationMethods.length + 1
//           : state.globalCommunicationMethods.length + 1),
//     };

//     if (editingMethod) {
//       updateCompanyCommunicationMethod(methodPayload);
//     } else {
//       addCompanyCommunicationMethod(methodPayload);
//     }

//     // Reset form
//     setMethodForm({
//       id: "",
//       name: "",
//       description: "",
//       sequence: 0,
//       isMandatory: false,
//       companyId: null,
//     });
//     setEditingMethod(null);
//     setSelectedCompanyForMethod(null);
//   };

//   const startEditMethod = (method, companyId) => {
//     setMethodForm({
//       ...method,
//       companyId: companyId,
//     });
//     setEditingMethod({ methodId: method.id, companyId });
//     setSelectedCompanyForMethod(companyId);
//   };

//   const handleAddMethodToCompany = (companyId) => {
//     setSelectedCompanyForMethod(companyId);
//     setMethodForm({
//       id: "",
//       name: "",
//       description: "",
//       sequence: 0,
//       isMandatory: false,
//       companyId: companyId,
//     });
//   };

//   // Render Contact Details
//   const renderContactDetails = (company) => {
//     return (
//       <div className="contact-details">
//         {/* Emails Section */}
//         <div className="contact-section">
//           <h4>Emails</h4>
//           {company.emails && company.emails.length > 0 ? (
//             <ul>
//               {company.emails.map((email, index) => (
//                 <li key={index}>
//                   <span className="email-icon">✉️</span> {email}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No email addresses</p>
//           )}
//         </div>

//         {/* Phone Numbers Section */}
//         <div className="contact-section">
//           <h4>Phone Numbers</h4>
//           {company.phoneNumbers && company.phoneNumbers.length > 0 ? (
//             <ul>
//               {company.phoneNumbers.map((phone, index) => (
//                 <li key={index}>
//                   <span className="phone-icon">📞</span> {phone}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No phone numbers</p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="company-list-page">
//       <h1>Companies Management</h1>

//       {/* Company Addition Form */}
//       <div className="company-addition-section">
//         <h2>{editingCompany ? "Edit Company" : "Add Company"}</h2>
//         <form onSubmit={handleAddCompany} className="company-form">
//           <input
//             type="text"
//             name="name"
//             value={companyForm.name}
//             onChange={handleCompanyChange}
//             placeholder="Company Name"
//             required
//           />
//           <input
//             type="text"
//             name="location"
//             value={companyForm.location}
//             onChange={handleCompanyChange}
//             placeholder="Location"
//           />
//           <input
//             type="url"
//             name="linkedinProfile"
//             value={companyForm.linkedinProfile}
//             onChange={handleCompanyChange}
//             placeholder="LinkedIn Profile"
//           />

//           {/* Email Management */}
//           <div className="email-management">
//             <h4>Emails</h4>
//             {companyForm.emails.map((email, index) => (
//               <input
//                 key={index}
//                 type="email"
//                 value={email}
//                 onChange={(e) => handleEmailChange(index, e.target.value)}
//                 placeholder="Email Address"
//               />
//             ))}
//             <button type="button" onClick={handleAddEmail}>
//               Add Email
//             </button>
//           </div>

//           {/* Phone Number Management */}
//           <div className="phone-management">
//             <h4>Phone Numbers</h4>
//             {companyForm.phoneNumbers.map((phone, index) => (
//               <input
//                 key={index}
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => handlePhoneChange(index, e.target.value)}
//                 placeholder="Phone Number"
//               />
//             ))}
//             <button type="button" onClick={handleAddPhone}>
//               Add Phone
//             </button>
//           </div>

//           <input
//             type="number"
//             name="communicationPeriodicity"
//             value={companyForm.communicationPeriodicity}
//             onChange={handleCompanyChange}
//             placeholder="Communication Frequency (days)"
//           />
//           <textarea
//             name="comments"
//             value={companyForm.comments}
//             onChange={handleCompanyChange}
//             placeholder="Additional Comments"
//           />
//           <button type="submit">
//             {editingCompany ? "Update Company" : "Add Company"}
//           </button>
//           {editingCompany && (
//             <button type="button" onClick={() => setEditingCompany(null)}>
//               Cancel
//             </button>
//           )}
//         </form>
//       </div>

//       {/* Existing Companies List */}
//       <div className="existing-companies">
//         <h2>Existing Companies</h2>
//         {state.companies.map((company) => (
//           <div key={company.id} className="company-card">
//             <div className="company-header">
//               <h2>{company.name}</h2>
//               <div className="company-actions">
//                 <button onClick={() => startEditCompany(company)}>
//                   Edit Company
//                 </button>
//                 <button onClick={() => deleteCompany(company.id)}>
//                   Delete Company
//                 </button>
//                 <button onClick={() => handleAddMethodToCompany(company.id)}>
//                   Add Communication Method
//                 </button>
//               </div>
//             </div>

//             <div className="company-info">
//               <div className="location-info">
//                 <strong>Location:</strong> {company.location || "N/A"}
//                 {company.linkedinProfile && (
//                   <div className="linkedin-profile">
//                     <strong>LinkedIn:</strong>{" "}
//                     <a
//                       href={company.linkedinProfile}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       Company Profile
//                     </a>
//                   </div>
//                 )}
//                 <p>
//                   Communication Frequency: {company.communicationPeriodicity}{" "}
//                   days
//                 </p>
//                 {company.comments && (
//                   <div className="company-comments">
//                     <strong>Comments:</strong> {company.comments}
//                   </div>
//                 )}
//               </div>

//               {/* Render Contact Details */}
//               {renderContactDetails(company)}
//             </div>

//             {/* Communication Methods Section */}
//             <div className="communication-methods">
//               <h3>Communication Methods</h3>
//               {company.communicationMethods.length > 0 ? (
//                 company.communicationMethods.map((method) => (
//                   <div key={method.id} className="method-item">
//                     <div className="method-details">
//                       <div className="method-header">
//                         <span className="method-name">{method.name}</span>
//                         <span className="method-type">
//                           {method.isMandatory ? "Mandatory" : "Optional"}
//                         </span>
//                       </div>
//                       <p className="method-description">{method.description}</p>
//                       <div className="method-footer">
//                         <span>Sequence: {method.sequence}</span>
//                         <div className="method-actions">
//                           <button
//                             onClick={() => startEditMethod(method, company.id)}
//                           >
//                             Edit Method
//                           </button>
//                           <button
//                             onClick={() =>
//                               deleteCompanyCommunicationMethod(
//                                 company.id,
//                                 method.id
//                               )
//                             }
//                           >
//                             Delete Method
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No communication methods defined</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Communication Method Management */}
//       {selectedCompanyForMethod && (
//         <div className="communication-method-management">
//           <h2>
//             {editingMethod
//               ? "Edit Communication Method"
//               : "Add Communication Method"}
//           </h2>
//           <form onSubmit={handleAddCommunicationMethod}>
//             <input
//               type="text"
//               name="name"
//               value={methodForm.name}
//               onChange={handleMethodChange}
//               placeholder="Method Name"
//               required
//             />
//             <input
//               type="text"
//               name="description"
//               value={methodForm.description}
//               onChange={handleMethodChange}
//               placeholder="Description"
//             />
//             <input
//               type="number"
//               name="sequence"
//               value={methodForm.sequence}
//               onChange={handleMethodChange}
//               placeholder="Sequence Order"
//             />
//             <label>
//               <input
//                 type="checkbox"
//                 name="isMandatory"
//                 checked={methodForm.isMandatory}
//                 onChange={handleMethodChange}
//               />
//               Mandatory Method
//             </label>
//             <button type="submit">
//               {editingMethod ? "Update Method" : "Add Method"}
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingMethod(null);
//                 setSelectedCompanyForMethod(null);
//               }}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CompanyListPage;
