import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../App"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

function useGetCurrentUser() {
    const dispatch = useDispatch()

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = localStorage.getItem("nova_token")

                const result = await axios.get(
                    `${serverUrl}/api/user/me`,
                    {
                        withCredentials: true,
                        headers: token
                            ? {
                                Authorization: `Bearer ${token}`
                            }
                            : {}
                    }
                )

                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            }
        }

        getCurrentUser()
    }, [dispatch])

    return null
}

export default useGetCurrentUser