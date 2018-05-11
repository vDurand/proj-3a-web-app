﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using SmartAgent.Services.DTO;
using SmartAgent.WcfService.filters;
using SmartAgent.Services.Pagination;

namespace SmartAgent.WcfService
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom d'interface "IService1" à la fois dans le code et le fichier de configuration.
    [ServiceContract]
    public interface IService1
    {

        [OperationContract]
        string GetData(int value);

        [OperationContract]
        [WebGet(UriTemplate = "/Tag")]
        string Tag();

        [OperationContract]
        [WebGet(UriTemplate = "/Init")]
        void Init();

        [OperationContract]
        [WebGet(UriTemplate = "/Clean")]
        void Clean();

        [OperationContract]
        CompositeType GetDataUsingDataContract(CompositeType composite);

        [OperationContract]
        [WebGet(UriTemplate = "/Agents")]
        AgentDTO[] GetAgents();

        [OperationContract]
        [WebGet(UriTemplate = "/Agents/?")]
        AgentsPag GetAgentsBis();





        [OperationContract]
        [WebGet(UriTemplate = "/Agents/{idA}")]
        AgentDTO GetAgent(string idA);

        [OperationContract]
        [WebGet(UriTemplate = "/Agents/Filters")]
        List<Filter> GetAgentsFilters();

        [OperationContract]
        [WebGet(UriTemplate = "/Tasks")]
        TacheDTO[] GetTasks();
        [OperationContract]

        [WebGet(UriTemplate = "/Tasks/{id}")]
        TacheDTO GetTask(string id);


        [OperationContract]
        [WebGet(UriTemplate = "/Tasks/?")]
        TachesPag GetTasksbis();

        [OperationContract]
        [WebGet(UriTemplate = "/Tasks/Filters")]
        List<Filter> GetTasksFilters();

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/Agents/", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int AddAgent(AgentDTO ag );

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "/Tasks/", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int AddTask(TacheDTO task);

        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/Agents/", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int UpdateAgent(AgentDTO ag);

        [OperationContract]
        [WebInvoke(Method = "PUT", UriTemplate = "/Tasks/", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        int UpdateTask(TacheDTO  task);

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/Agents/{idA}")]
        int DeleteAgent(string idA);

        [OperationContract]
        [WebInvoke(Method = "DELETE", UriTemplate = "/Tasks/{idT}")]
        int DeleteTask(string idT);

        // TODO: ajoutez vos opérations de service ici
    }


    // Utilisez un contrat de données comme indiqué dans l'exemple ci-après pour ajouter les types composites aux opérations de service.
    [DataContract]
    public class CompositeType
    {
        bool boolValue = true;
        string stringValue = "Hello ";

        [DataMember]
        public bool BoolValue
        {
            get { return boolValue; }
            set { boolValue = value; }
        }

        [DataMember]
        public string StringValue
        {
            get { return stringValue; }
            set { stringValue = value; }
        }
    }
}
