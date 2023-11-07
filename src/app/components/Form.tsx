import useZodForm from '../hooks/useZodForm';
import { z } from 'zod';
import Button from './Button';
import Input from './Input';
import { parse } from '@plussub/srt-vtt-parser';
  
export const schema = z.object({
    videoUrl: z
        .string()
        .nonempty("Please enter video url"),
    searchQuery: z
        .string()
        .nonempty("Please enter search query"),
});
  
export default function Form({ setData, request }: any) {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting, isDirty },
    } = useZodForm({
        schema,
        defaultValues: {
            videoUrl: '',
            searchQuery: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = handleSubmit(async (formData) => {
        const data = await request();
        data.videoUrl = formData.videoUrl;
        setData(data);
        const { entries } = parse(data.captionsVtt);
        entries.forEach(({ from, to, text }) => {
            console.log("from:" + from);
            console.log("to:" + to);
            console.log("text:" + text);
        });
        const result = entries.filter((item) => item.text.toLocaleLowerCase().includes(formData.searchQuery.toLocaleLowerCase()));
        console.log("Result:");
        result.forEach(({ from, to, text }) => {
            console.log("from:" + from);
            console.log("to:" + to);
            console.log("text:" + text);
        });
    });

    return (
        <form onSubmit={onSubmit} className="flex flex-col paper bg-[#F0F0F0] h-max w-80 p-4 rounded-2xl ml-10 mt-10">
            <Input
                placeholder="Video url"
                name="videoUrl"
                register={register}
                errors={errors}
            />
            <Input
                placeholder="Search query"
                name="searchQuery"
                register={register}
                errors={errors}
            />
            <Button type="submit" disabled={!isValid || !isDirty || isSubmitting}>
                Submit
            </Button>
        </form>
    );
}