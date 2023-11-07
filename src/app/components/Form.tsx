import useZodForm from '../hooks/useZodForm';
import { z } from 'zod';
import Button from './Button';
import Input from './Input';

  
export const schema = z.object({
    videoUrl: z
        .string()
        .nonempty("Please enter video url"),
    searchQuery: z
        .string()
        .nonempty("Please enter search query"),
});
  
export default function Form() {
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

    const onSubmit = handleSubmit((data) => {
        alert("submit")
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