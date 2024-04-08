import { useRouter } from 'next/router'
import { baseURL, frontURL } from '@/lib/fetchConfig'
import useSWR from 'swr'

export const useFetch = () => {
    const router = useRouter()

    const loadingMsg = <div className='center'>Loading...</div>;
    const errorMsg = <div className='center'>Failed to load, Please try again later.</div>;

    const swr = ({ url }) => {
        const fetcher = async (...args) =>
            await fetch(...args).then(res => res.json())

        return useSWR(
            `${baseURL}${url}`,
            fetcher,
        );
    }

    const create = async ({ url, setErrors, formData }) => {
        setErrors([])
        await fetch(baseURL + url, {
            method: "POST",
            body: formData
        }).then(async res => {
            const r = await res.json();
            if (r.isDone) {
                router.push(frontURL + "/" + r.username);
            }
        })
    }

    return {
        create,
        swr,
        errorMsg,
        loadingMsg
    }
}
