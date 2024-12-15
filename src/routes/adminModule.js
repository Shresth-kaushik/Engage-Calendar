import React, { useState } from "react";
import { useCommunication } from "../context/data";
import "./adminModule.css";

function AdminModule() {
  const {
    state,
    addCompany,
    updateCompany,
    deleteCompany,
    updateCommunicationMethod,
    deleteCommunicationMethod,
    addCommunicationMethod,
  } = useCommunication();

  // Company Management State
  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
  });

  // Communication Method Management State
  const [methodForm, setMethodForm] = useState({
    id: "",
    name: "",
    description: "",
    sequence: 0,
    isMandatory: false,
  });

  // Edit Mode States
  const [editingCompany, setEditingCompany] = useState(false);
  const [editingMethod, setEditingMethod] = useState(false);

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

  const handleAddNewCommunicationMethod = (e) => {
    e.preventDefault();
    // Validate inputs
    if (!methodForm.name) {
      alert("Method name is required");
      return;
    }

    if (editingMethod) {
      updateCommunicationMethod({
        ...methodForm,
      });
      setEditingMethod(false);
    } else {
      // Use the new method to add a communication method
      addCommunicationMethod({
        name: methodForm.name,
        description: methodForm.description,
        sequence: methodForm.sequence || state.communicationMethods.length + 1,
        isMandatory: methodForm.isMandatory,
      });
    }

    // Reset form
    setMethodForm({
      id: "",
      name: "",
      description: "",
      sequence: 0,
      isMandatory: false,
    });
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompany(companyForm);
      setEditingCompany(false);
    } else {
      addCompany(companyForm);
    }

    // Reset form
    setCompanyForm({
      id: "",
      name: "",
      location: "",
      linkedinProfile: "",
      emails: [""],
      phoneNumbers: [""],
      comments: "",
      communicationPeriodicity: 14,
    });
  };

  // Edit Company
  const startEditCompany = (company) => {
    setCompanyForm(company);
    setEditingCompany(true);
  };

  // Communication Method Form Handlers
  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //   const handleAddCommunicationMethod = (e) => {
  //     e.preventDefault();
  //     if (editingMethod) {
  //       updateCommunicationMethod({
  //         ...methodForm,
  //       });
  //       setEditingMethod(false);
  //     } else {
  //       updateCommunicationMethod({
  //         ...methodForm,
  //         id: `method_${Date.now()}`,
  //       });
  //     }

  //     // Reset form
  //     setMethodForm({
  //       id: "",
  //       name: "",
  //       description: "",
  //       sequence: 0,
  //       isMandatory: false,
  //     });
  //   };

  // Edit Communication Method
  const startEditMethod = (method) => {
    setMethodForm(method);
    setEditingMethod(true);
  };

  return (
    <div className="admin-module">
      <h1>Admin Module</h1>

      <section className="company-management">
        <h2>{editingCompany ? "Edit Company" : "Add Company"}</h2>
        <form onSubmit={handleAddCompany}>
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
          <button type="submit">
            {editingCompany ? "Update Company" : "Add Company"}
          </button>
          {editingCompany && (
            <button type="button" onClick={() => setEditingCompany(false)}>
              Cancel
            </button>
          )}
        </form>

        <div className="company-list">
          <h3>Existing Companies</h3>
          {state.companies.map((company) => (
            <div key={company.id} className="company-item">
              {company.name} - {company.location}
              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>Edit</button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="communication-method-management">
        <h2>
          {editingMethod
            ? "Edit Communication Method"
            : "Add Communication Method"}
        </h2>
        <form onSubmit={handleAddNewCommunicationMethod}>
          <input
            type="text"
            name="name"
            value={methodForm.name}
            onChange={handleMethodChange}
            placeholder="Method Name"
            required
          />
          <input
            type="text"
            name="description"
            value={methodForm.description}
            onChange={handleMethodChange}
            placeholder="Description"
          />
          <input
            type="number"
            name="sequence"
            value={methodForm.sequence}
            onChange={handleMethodChange}
            placeholder="Sequence Order"
          />
          <label>
            <input
              type="checkbox"
              name="isMandatory"
              checked={methodForm.isMandatory}
              onChange={handleMethodChange}
            />
            Mandatory Method
          </label>
          <button type="submit">
            {editingMethod ? "Update Method" : "Add Method"}
          </button>
          {editingMethod && (
            <button type="button" onClick={() => setEditingMethod(false)}>
              Cancel
            </button>
          )}
        </form>

        <div className="communication-methods-list">
          <h3>Existing Communication Methods</h3>
          {state.communicationMethods.map((method) => (
            <div key={method.id} className="method-item">
              {method.name} - {method.description}
              (Sequence: {method.sequence},
              {method.isMandatory ? "Mandatory" : "Optional"})
              <div className="method-actions">
                <button onClick={() => startEditMethod(method)}>Edit</button>
                <button onClick={() => deleteCommunicationMethod(method.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminModule;

// import React, { useState } from "react";
// import { useCommunication } from "../context/data";
// import "./adminModule.css";

// function AdminModule() {
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
//   const [editingCompany, setEditingCompany] = useState(false);
//   const [editingMethod, setEditingMethod] = useState(false);
//   const [selectedCompanyForMethod, setSelectedCompanyForMethod] =
//     useState(null);

//   // Company Form Handlers (previous implementation remains the same)
//   // ... (keep existing handleCompanyChange, handleEmailChange, etc. methods)

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
//     setEditingCompany(true);
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
//       setEditingCompany(false);
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
//     setEditingMethod(false);
//     setSelectedCompanyForMethod(null);
//   };

//   const startEditMethod = (method, companyId) => {
//     setMethodForm({
//       ...method,
//       companyId: companyId,
//     });
//     setEditingMethod(true);
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

//   return (
//     <div className="admin-module">
//       <h1>Admin Module</h1>

//       <section className="company-management">
//         {/* Company form remains the same */}
//         <h2>{editingCompany ? "Edit Company" : "Add Company"}</h2>
//         <form onSubmit={handleAddCompany}>
//           {/* ... existing company form inputs ... */}

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
//             <button type="button" onClick={() => setEditingCompany(false)}>
//               Cancel
//             </button>
//           )}
//         </form>
//       </section>
//     </div>
//   );
// }

// export default AdminModule;
