import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type VacationDraft from "../../../../models/VacationDraft";
import type Vacation from "../../../../models/Vacation";
import "./VacationForm.css";

interface VacationFormProps {
    vacation?: Vacation;
    onSubmit: (draft: VacationDraft) => Promise<void>;
    onCancel: () => void;
}

export default function VacationForm({ vacation, onSubmit, onCancel }: VacationFormProps) {
    const isEdit = vacation

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<VacationDraft>();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [hasExistingImage, setHasExistingImage] = useState(false);
    const startDateValue = watch("startDate");

    useEffect(() => {
        if (!vacation) return
        reset(vacation)
        
        if (vacation.imageUrl) {
            setPreviewUrl(vacation.imageUrl);
            setFileName("Current image");
            setHasExistingImage(true);
        }
    }, [vacation])

    const submitHandler = async (data: VacationDraft) => {
        const imageFileList = data.image as unknown as FileList;
        const finalImage = imageFileList?.[0] || null;

        await onSubmit({
            ...data,
            image: finalImage
        })
    }

    const Error = ({ name }: { name: keyof VacationDraft }) => {
        const err = errors[name];
        if (!err) return null;
        return <div className="error-box">{err.message}</div>;
    }

    return (
        <form className="vacation-form" onSubmit={handleSubmit(submitHandler)}>
            {!!Object.keys(errors).length && (
                <div className="error-summary">
                    <ul>{Object.values(errors).map((e, i) => <li key={i}>{e?.message}</li>)}</ul>
                </div>
            )}

            <label className="field-label">Destination</label>
            <input
                placeholder="Enter destination"
                {...register("destination", {
                    required: "Destination is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    maxLength: { value: 100, message: "Maximum 100 characters" }
                })}
            />
            <Error name="destination" />

            <label className="field-label">Description</label>
            <textarea
                placeholder="Enter description"
                {...register("description", {
                    required: "Description is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    maxLength: { value: 1000, message: "Maximum 1000 characters" }
                })}
            />
            <Error name="description" />

            <label className="field-label">Start Date</label>
            <input
                type="date"
                {...register("startDate", {
                    required: "Start date is required",
                    validate: {
                        notPast: v => {
                            const today = new Date(); today.setHours(0, 0, 0, 0);
                            return new Date(v) >= today || "Start date cannot be in the past";
                        }
                    }
                })}
            />
            <Error name="startDate" />

            <label className="field-label">End Date</label>
            <input
                type="date"
                {...register("endDate", {
                    required: "End date is required",
                    validate: {
                        greaterThanStart: v =>
                            !startDateValue || new Date(v) > new Date(startDateValue)
                            || "End date must be after start date"
                    }
                })}
            />
            <Error name="endDate" />

            <label className="field-label">Price</label>
            <input
                type="number"
                placeholder="Enter price"
                {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Minimum 0" },
                    max: { value: 10000, message: "Maximum 10000" }
                })}
            />
            <Error name="price" />

            {previewUrl && (
                <div className="image-preview">
                    <img src={previewUrl} alt="preview" />
                </div>
            )}

            <label className="field-label">Image {hasExistingImage && "(Optional - leave empty to keep current)"}</label>
            <div className="fake-file-input">
                <span>{fileName || "No file chosen"}</span>

                <label className="choose-btn">
                    Choose File
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image", {
                            required: !isEdit && "Image is required",
                            onChange: (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setFileName(file.name);
                                setHasExistingImage(false);

                                if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(URL.createObjectURL(file));
                            }
                        })}
                    />
                </label>
            </div>
            <Error name="image" />

            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}