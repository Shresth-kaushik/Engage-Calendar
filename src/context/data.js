import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Initial Communication Methods
const DEFAULT_COMMUNICATION_METHODS = [
  {
    id: uuidv4(),
    name: "LinkedIn Post",
    description: "Post on LinkedIn",
    sequence: 1,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "LinkedIn Message",
    description: "Send a direct message on LinkedIn",
    sequence: 2,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "Email",
    description: "Send an email",
    sequence: 3,
    isMandatory: true,
  },
  {
    id: uuidv4(),
    name: "Phone Call",
    description: "Make a phone call",
    sequence: 4,
    isMandatory: false,
  },
  {
    id: uuidv4(),
    name: "Other",
    description: "Other communication method",
    sequence: 5,
    isMandatory: false,
  },
];

// Initial State
const initialState = {
  companies: [],
  communicationMethods: DEFAULT_COMMUNICATION_METHODS,
  communications: [],
};

// Action Types
const ADD_COMMUNICATION = "ADD_COMMUNICATION";
const UPDATE_COMPANY_LAST_COMMUNICATION = "UPDATE_COMPANY_LAST_COMMUNICATION";

const ADD_COMPANY = "ADD_COMPANY";
const UPDATE_COMPANY = "UPDATE_COMPANY";
const DELETE_COMPANY = "DELETE_COMPANY";
const UPDATE_COMMUNICATION_METHOD = "UPDATE_COMMUNICATION_METHOD";
const DELETE_COMMUNICATION_METHOD = "DELETE_COMMUNICATION_METHOD";
const ADD_COMMUNICATION_METHOD = "ADD_COMMUNICATION_METHOD";

// Reducer
function communicationReducer(state, action) {
  switch (action.type) {
    case ADD_COMPANY:
      return {
        ...state,
        companies: [
          ...state.companies,
          {
            ...action.payload,
            id: uuidv4(),
            createdAt: new Date(),
            lastCommunicationDate: new Date(), // Add initial communication date
            lastCommunicationSequence: 0, // Start with first sequence
          },
        ],
        // communications: [
        //   ...state.communications,
        //   {
        //     id: uuidv4(),
        //     companyId: action.payload.id || uuidv4(),
        //     type: "Initial Contact",
        //     timestamp: new Date(),
        //     notes: "Company added to tracking system",
        //     sequence: 1,
        //   },
        // ],
      };
    case UPDATE_COMPANY:
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id
            ? { ...company, ...action.payload }
            : company
        ),
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          (company) => company.id !== action.payload
        ),
      };
    case UPDATE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.map((method) =>
          method.id === action.payload.id
            ? { ...method, ...action.payload }
            : method
        ),
      };
    case DELETE_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: state.communicationMethods.filter(
          (method) => method.id !== action.payload
        ),
      };

    case ADD_COMMUNICATION_METHOD:
      return {
        ...state,
        communicationMethods: [
          ...state.communicationMethods,
          {
            ...action.payload,
            id: action.payload.id || uuidv4(),
          },
        ],
      };

    case ADD_COMMUNICATION:
      const sortedMethods = state.communicationMethods.sort(
        (a, b) => a.sequence - b.sequence
      );
      const currentCompany = state.companies.find(
        (c) => c.id === action.payload.companyId
      );

      const nextMethodSequence =
        currentCompany.lastCommunicationSequence === sortedMethods.length
          ? currentCompany.lastCommunicationSequence
          : currentCompany.lastCommunicationSequence + 1;

      return {
        ...state,
        communications: [
          ...state.communications,
          {
            ...action.payload,
            id: uuidv4(),
            createdAt: new Date(),
            sequence: nextMethodSequence,
          },
        ],
        companies: state.companies.map((company) =>
          company.id === action.payload.companyId
            ? {
                ...company,
                lastCommunicationDate: action.payload.timestamp,
                lastCommunicationSequence: nextMethodSequence,
              }
            : company
        ),
      };

    default:
      return state;
  }
}

// Context Creation
const CommunicationContext = createContext();

// Provider Component
export function CommunicationProvider({ children }) {
  const [state, dispatch] = useReducer(communicationReducer, initialState);

  // Action Creators
  const addCompany = useCallback((company) => {
    dispatch({
      type: ADD_COMPANY,
      payload: {
        ...company,
        emails: company.emails || [""],
        phoneNumbers: company.phoneNumbers || [""],
        communicationPeriodicity: company.communicationPeriodicity || 14,
      },
    });
  }, []);

  const addCommunication = useCallback((communicationData) => {
    dispatch({
      type: ADD_COMMUNICATION,
      payload: communicationData,
    });
  }, []);

  const getLastFiveCommunications = useCallback(
    (companyId) => {
      return state.communications
        .filter((comm) => comm.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    },
    [state.communications]
  );

  const getNextScheduledCommunication = useCallback(
    (companyId) => {
      const company = state.companies.find((c) => c.id === companyId);
      if (!company) return null;

      const sortedMethods = state.communicationMethods.sort(
        (a, b) => a.sequence - b.sequence
      );
      const currentSequence = company.lastCommunicationSequence || 1;
      const nextMethod =
        sortedMethods.find((m) => m.sequence > currentSequence) ||
        sortedMethods[sortedMethods.length - 1];

      const lastCommunication = new Date(
        company.lastCommunicationDate || new Date(0)
      );

      const nextCommunicationDate = new Date(
        lastCommunication.getTime() +
          (company.communicationPeriodicity || 14) * 24 * 60 * 60 * 1000
      );

      return {
        date: nextCommunicationDate,
        type: nextMethod.name,
        sequence: nextMethod.sequence,
      };
    },
    [state.companies, state.communicationMethods]
  );

  const getOverdueCommunications = useCallback(() => {
    const today = new Date();
    return state.companies.filter((company) => {
      if (!company.lastCommunicationDate) return true;
      const daysSinceLastCom =
        (today.getTime() - new Date(company.lastCommunicationDate).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceLastCom > (company.communicationPeriodicity || 14);
    });
  }, [state.companies]);

  const getAllCommunicationsForCompany = useCallback(
    (companyId) => {
      return state.communications
        .filter((comm) => comm.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },
    [state.communications]
  );

  const updateCompany = useCallback((company) => {
    dispatch({ type: UPDATE_COMPANY, payload: company });
  }, []);

  const deleteCompany = useCallback((companyId) => {
    dispatch({ type: DELETE_COMPANY, payload: companyId });
  }, []);

  const addCommunicationMethod = useCallback(
    (method) => {
      dispatch({
        type: ADD_COMMUNICATION_METHOD,
        payload: {
          ...method,
          id: method.id || `method_${Date.now()}`,
          sequence: method.sequence || state.communicationMethods.length + 1,
        },
      });
    },
    [state.communicationMethods]
  );

  // Communication Method Actions
  const updateCommunicationMethod = useCallback((method) => {
    dispatch({ type: UPDATE_COMMUNICATION_METHOD, payload: method });
  }, []);

  const deleteCommunicationMethod = useCallback((methodId) => {
    dispatch({ type: DELETE_COMMUNICATION_METHOD, payload: methodId });
  }, []);

  // Helper Functions
  const getCompanyById = useCallback(
    (id) => {
      return state.companies.find((company) => company.id === id);
    },
    [state.companies]
  );

  return (
    <CommunicationContext.Provider
      value={{
        state,
        addCommunication,
        getLastFiveCommunications,
        getNextScheduledCommunication,
        getAllCommunicationsForCompany,
        addCompany,
        updateCompany,
        deleteCompany,
        addCommunicationMethod,
        updateCommunicationMethod,
        deleteCommunicationMethod,
        getCompanyById,
        getOverdueCommunications,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

// Custom Hook
export function useCommunication() {
  const context = useContext(CommunicationContext);
  if (!context) {
    throw new Error(
      "useCommunication must be used within a CommunicationProvider"
    );
  }
  return context;
}
