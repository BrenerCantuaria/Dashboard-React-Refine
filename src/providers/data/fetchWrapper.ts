import {GraphQLFormattedError} from "graphql"

type Error = {
    message: string,
    statusCode: string
}

//  Obtém o token de acesso do localStorage (access_token)
// Converte os headers das opções para um objeto Record<string, string>
// Espalhas as options com spred-operator
// Mantem os headers originais e adicionar o Token no headers 


const customFetch = async (url:string, options: RequestInit) => {
    const acessToken = localStorage.getItem("access_token")

    const headers = options.headers as Record<string, string>

    return await fetch(url,{
        ...options,
        headers:{
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${acessToken}`,
            "Content-Type": "application/json",
            "Apollo-Required-Preflight": "true",
        }
    })
}



// Se o body for null/undefined, retorna um erro genérico
// Extrai a lista de erros
// Concatena todas as mensagens de erro em uma única string

const getGraphQLErros = (body: Record<"erros", GraphQLFormattedError[] | undefined>): Error | null => {
    if(!body) {
        return {
            message: "Unknown error",
            statusCode: "INTERNAL_SERVER_ERROR",
        }
    }

    if("erros" in body) {
        const errors = body?.erros
        const messages = errors?.map(error=> error?.message).join("")
        const code = errors?.[0]?.extensions?.code
        
        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }
    return null
}

export const fetchWrapper = async (url:string, options: RequestInit) => {
    const response = await customFetch(url,options)
    const responseClone = response.clone()
    const body = await responseClone.json()

    const error = getGraphQLErros(body)
    if(error){
        throw error
    }
    return response
}

