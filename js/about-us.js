const API_BASE_URL = '/api';
async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/delete-employee/${employeeId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result);
            fetchAndDisplayEmployees();
        } else {
            console.error("Error deleting employee:", result.message);
        }
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
 }
// async function updateEmployee(e) {
//     e.preventDefault();

//     const employeeId = document.getElementById('update-id').value;

//     const formData = new FormData();
//     formData.append('name[gr]', document.getElementById('update-name-gr').value);
//     formData.append('name[en]', document.getElementById('update-name-en').value);
//     formData.append('title[gr]', document.getElementById('update-title-gr').value);
//     formData.append('title[en]', document.getElementById('update-title-en').value);
    
//     const updatedImage = document.getElementById('update-image').files[0];
//     if (updatedImage) {
//         formData.append('image', updatedImage);
//     }

//     try {
//         const response = await fetch(`${API_BASE_URL}/update-employee/${employeeId}`, {
//             method: 'PUT',
//             body: formData
//         });

//         const result = await response.json();

//         if (response.ok) {
//             console.log('Employee updated:', result);
//             fetchAndDisplayEmployees();
//         } else {
//             console.error("Error updating employee:", result.message);
//         }
//     } catch (error) {
//         console.error("Error updating employee:", error);
//     }
// }

async function addEmployee(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name[gr]', document.getElementById('name-gr').value);
    formData.append('name[en]', document.getElementById('name-en').value);
    formData.append('title[gr]', document.getElementById('title-gr').value);
    formData.append('title[en]', document.getElementById('title-en').value);
    formData.append('store', document.querySelector('input[name="store"]:checked').value);
    formData.append('image', document.getElementById('image').files[0]);


    try {
        const response = await fetch(`${API_BASE_URL}/add-employee`, {
            method: 'POST',
            // No need to set Content-Type; it will be set automatically
            body: formData  // Send formData instead of employeeData
        });

        const result = await response.json();
        console.log(result);
        fetchAndDisplayEmployees();
    } catch (error) {
        console.error("Error adding employee:", error);
    }
}

let cropper;

function previewImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageElement = document.getElementById('image-preview');
            imageElement.src = event.target.result;
            
            // Initialize cropper on this image
            if (cropper) cropper.destroy();
            cropper = new Cropper(imageElement, {
                aspectRatio: 1 // you can set this to any desired ratio
            });
        }
        reader.readAsDataURL(file);
    }
}

function cropAndUpload() {
    if (cropper) {
        cropper.getCroppedCanvas().toBlob(async (blob) => {
            const formData = new FormData();

            formData.append('name[gr]', document.getElementById('name-gr').value);
            formData.append('name[en]', document.getElementById('name-en').value);
            formData.append('title[gr]', document.getElementById('title-gr').value);
            formData.append('title[en]', document.getElementById('title-en').value);
            formData.append('store', document.querySelector('input[name="store"]:checked').value);
            formData.append('image', blob, 'croppedImageName.jpg'); // Append the blob here
            
            // ... Add other form data here ...

            try {
                const response = await fetch(`${API_BASE_URL}/add-employee`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                console.log(result);
                fetchAndDisplayEmployees();
            } catch (error) {
                console.error("Error adding employee:", error);
            }
        });
    }
}

async function fetchAndDisplayEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        const employees = await response.json();
        const employeeListContainer = document.getElementById('employee-list');

        employeeListContainer.innerHTML = ''; // Clear the container

        // Group employees by store
        const storeGroups = {};
        employees.forEach(employee => {
            if (!storeGroups[employee.store]) {
                storeGroups[employee.store] = [];
            }
            storeGroups[employee.store].push(employee);
        });

        // Display each group
        Object.keys(storeGroups).forEach(store => {
            const storeHeading = document.createElement('h3');
            storeHeading.textContent = store;
            employeeListContainer.appendChild(storeHeading);

            storeGroups[store].forEach(employee => {
                const div = document.createElement('div');
                
                const img = document.createElement('img');
                img.src = employee.image;
                img.alt = employee.name ? employee.name.gr : 'Employee Name';
                
                const pName = document.createElement('p');
                pName.textContent = employee.name ? employee.name.gr : 'Unknown Name';
                
                const pTitle = document.createElement('p');
                pTitle.textContent = employee.title ? employee.title.gr : 'Unknown Title';
                
                const btnUpdate = document.createElement('button');
                btnUpdate.textContent = 'Update';
                btnUpdate.onclick = () => populateUpdateForm(employee);
                
                const btnDelete = document.createElement('button');
                btnDelete.textContent = 'Delete';
                btnDelete.onclick = () => deleteEmployee(employee._id);  
                
                div.appendChild(img);
                div.appendChild(pName);
                div.appendChild(pTitle);
                div.appendChild(btnUpdate);
                div.appendChild(btnDelete);

                employeeListContainer.appendChild(div);
            });
        });

    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

async function updateEmployee(e) {
// Ensure we're correctly getting the employeeId:
const employeeId = document.getElementById('update-id').value;
if (!employeeId) {
    console.error("Employee ID is missing or not set.");
    return; // Exit the function if there's no employee ID
}
    // Create a new FormData object
    const formData = new FormData();

    formData.append('name[gr]', document.getElementById('update-name-gr').value);
    formData.append('name[en]', document.getElementById('update-name-en').value);
    formData.append('title[gr]', document.getElementById('update-title-gr').value);
    formData.append('title[en]', document.getElementById('update-title-en').value);

    // Only add the image to the formData if it has been modified
    const updatedImage = document.getElementById('update-image').files[0];
    if (updatedImage) {
        formData.append('image', updatedImage);
    }



    try {
        const response = await fetch(`${API_BASE_URL}/update-employee/${employeeId}`, {
            method: 'PUT',
            body: formData // use formData here
        });

        const result = await response.json();
        console.log(result);
        fetchAndDisplayEmployees();
    } catch (error) {
        console.error("Error updating employee:", error);
    }
}
document.getElementById('crop-upload').addEventListener('click', cropAndUpload);
document.getElementById('add-employee-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting
    // You can also call cropAndUpload() here if needed
});
function populateUpdateForm(employee) {
    document.getElementById('update-id').value = employee._id;
    document.getElementById('update-name-gr').value = employee.name.gr;
    document.getElementById('update-name-en').value = employee.name.en;
    document.getElementById('update-title-gr').value = employee.title.gr;
    document.getElementById('update-title-en').value = employee.title.en;
}
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayEmployees();
    document.getElementById('add-employee-form').addEventListener('submit', addEmployee);
    document.getElementById('update-employee-form').addEventListener('submit', updateEmployee);

    

});
