var formData = {
  name: null,
  fields: []
}

var $preview = $('#preview');
var $fieldForm = $('form[name=builder]')
var $typeInput = $('#typeInput');
var $nameInput = $('#nameInput');
var $requiredInput = $('#requiredInput');
var $placeholderInput = $('#placeholderInput');

// Template Functions
var formTmpl = _.template($('#formTmpl').text());
var inputTmpl = _.template($('#inputTmpl').text());
var emailTmpl = _.template($('#emailTmpl').text());

// Field Builder submit handler
$fieldForm.on('submit', function(event) {
  event.preventDefault();
  
  var fieldType = $typeInput.val();
  var fieldName = $nameInput.val();
  var isRequired = $requiredInput.prop('checked');
  var placeholder = $placeholderInput.val();
  
  formData.fields.push({
    type: fieldType,
    name: fieldName,
    required: isRequired,
    placeholder: placeholder
  })
  
  renderFormPreview();
});

function renderFormPreview() {
  var $formContent = $(formTmpl(formData));
  var $formFields = $formContent.find('#fields');
  formData.fields.forEach(function (field) {
    $formFields.append(renderField(field));
  })
  $preview.html($formContent);
}

function renderField(fieldData) {
  switch (fieldData.type) {
    case 'input':
      return inputTmpl(fieldData)
    case 'email':
      return emailTmpl(fieldData)
    default:
      return;
  }
}