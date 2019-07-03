var image_autofilled=false;
var autofill_image=null;
var image=null;

    $("#id").focus(function(){
        $(this).css('border-color','red');
    });

    $('#name').autocomplete({
    lookup: function (query, done) {
     var result= null;

    $.get( "/suggest/"+query
        ,function(data){

        console.log(data)
        result={suggestions:data};
        done(result);

    });
    },
    onSelect: function (suggestions) {
        $("#name").val(suggestions.data[0]);
        $("#email").val(suggestions.data[1]);
        autofill_image="https://persistentsystems.sharepoint.com/sites/Pi/_layouts/15/userphoto.aspx?size=L&username="+suggestions.data[1];
        $("#imagePreview").attr("style","background-image:url("+autofill_image+")");
        image_autofilled=true;
        image=autofill_image;
    }
});

$(document).ready(function(){


var is_updated=false;
var pre_id=null

    $("#add_emp").click(function(){
        $("#frame_1").hide();
        $("#frame_2").fadeIn();

    });

    $("#cancel").click(function(){
        $("#frame_2").hide();
        $("#frame_1").fadeIn();

    });


    $("#submit").click(function(){
          var id = $('#id').val();
          var fullname = $('#name').val();
          var gender = $('#gender').val();
          var email = $('#email').val();
          var indexat = email.indexOf("@");
          var indexdot = email.indexOf(".");
          var dob= $('#dob').val();
          var mobileno = $('#contact').val();


            if(id == '')
            {
              alert('Please enter id');
              $('#id').focus();
            }
            else if(fullname == '')
            {
              alert('Please enter your Full Name');
              $('#fullname').focus(); //The focus function will move the cursor to "fullname" field
            }
            else if(dob == '')
            {
              alert('Please select date of birth');
              $('#gender').focus();
            }
            else if(mobileno == '')
            {
              alert('Please enter your Mobile Number');
              $('#contact').focus();
            }

            else if(indexat < 1 || (indexdot-indexat) < 2)
            {
              alert('Please enter a valid Email Id');
              $('#email').focus();
            }
            else if(image==null && image_autofilled==false)
            {
              alert('Please upload picture');
            }

            else{

                var emp={id:id,name:fullname,gender:gender,dob:dob,email:email,contact:mobileno,image:image}
                var empJSON=JSON.stringify(emp)

                if(is_updated==false){

                   $.ajax({
                        url: '/emp',
                        data:{
                                data:empJSON
                             },
                        type: 'POST',
                        success: function(result) {
                            if(result == 'Created!!'){
                                 window.location="/";
                             }
                        },
                        error: function(error){
                            $('#InsertError').fadeIn();
                            setTimeout(function(){ $('#InsertError').hide(); }, 4000);
                            $("#id").focus();
                        }
                    });


                }
                else{
                    $.ajax({
                        url: '/emp',
                        data:{
                                pre_id:pre_id,
                                data:empJSON
                             },
                        type: 'PUT',
                        success: function(result) {
                            if(result == 'Updated!!'){
                                 window.location="/";
                             }
                        },
                        error: function(error){
                            $('#InsertError').fadeIn();
                            setTimeout(function(){ $('#InsertError').hide(); }, 4000);
                             $("#id").focus();
                        }
                    });
                }

            }

    });



     $("#download_csv").click(function(){

        window.open('/data.csv','_blank');

    });



function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            image=e.target.result
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});

$(".editBtn").click(function(){

    $("#frame_1").hide();
    $("#frame_2").fadeIn();

    var td=$(this).parent();
    var tr=$(td).parent();
    var td_data=$(tr).children();
    pre_id=$(td_data[1]).html();

    $("#id").val($(td_data[1]).html());
    $("#name").val($(td_data[2]).html());
    $("#dob").val($(td_data[3]).html());
    $("#gender").val($(td_data[4]).html());
    $("#email").val($(td_data[6]).html());
    $("#contact").val($(td_data[5]).html());
    var pre_img=$(td_data[0]).children()[0];
    image=$(pre_img).attr("image_data");
    $("#imagePreview").attr("style","background-image:url("+$(pre_img).attr("image_data")+")");
    is_updated=true;

});

$(".removeBtn").click(function(){
    var td=$(this).parent();
    var tr=$(td).parent();
    var td_data=$(tr).children();
    pre_id=$(td_data[1]).html();
    console.log(pre_id);
    $.ajax({
        url: '/emp',
        data:{
                pre_id: pre_id,
             },
        type: 'DELETE',
        success: function(result) {
            if(result == 'Deleted!!'){
                 window.location="/";
             }
        }
    });
});

});