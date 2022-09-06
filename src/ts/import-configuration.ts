import { Validator } from "checkeasy";
import { ToastInterface } from "vue-toastification";

/**
 *
 * @param file that should be imported
 * @param validator the schema of the object to ensure the imported file is valid
 * @param toast a toast instance to show the user visual feedback
 * @returns a Promise of the configuration object
 */
export async function importConfiguration(
  file: File,
  validator: Validator<any>,
  toast: ToastInterface
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (result) => {
      if (result == null || result.target == null) {
        toast.error(
          "Something went wrong while reading the configuration file!"
        );
        reject();
        return;
      }
      try {
        const content = JSON.parse(result.target.result as string);
        const validatedContent = validator(content, "configuration");
        toast.success(
          "Successfully imported configuration. Make sure to save the configuration if you want to keep the imported configuration!"
        );
        resolve(validatedContent);
      } catch (e) {
        toast.error(
          "Something went wrong while importing the configuration file! Seems like the configuration file is not in the right format!"
        );
        reject(e);
      }
    };
    reader.onerror = (err) => {
      console.log(err);
      toast.error("Something went wrong while reading the configuration file!");
      reject(err);
    };
    reader.readAsText(file);
  });
}
